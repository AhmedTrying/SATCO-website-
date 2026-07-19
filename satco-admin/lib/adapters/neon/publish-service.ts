/*
 * Neon PublishService — the working link to the site (kickoff §2.2 / §3).
 *
 * publish() snapshots the Neon draft → published row, writes the site's generated
 * content JSON (satco-web/content/generated/*.json — the DA3 build target, still a
 * filesystem write while the admin runs locally), and records publish history +
 * audit rows in Postgres. Rebuild stays manual (`npm run build:web`).
 *
 * When the dashboard itself is deployed (read-only serverless FS), this flips to a
 * build-time content fetch + a debounced deploy hook instead of the local JSON
 * write — see docs/NEON-SWAP.md §2. The interface is unchanged either way.
 */

import type { ContentBundle, PublishRecord } from "@satco/shared";

import type { PublishDiffEntry, PublishService } from "../types";
import { makeId, writeGeneratedContent } from "../local/store";
import { query, jsonbParam } from "../../db";
import { neonAuditLog } from "./audit-log";
import { neonContentStore, writePublishedSnapshot } from "./content-store";
import { toPublish, type PublishRow } from "./mappers";

/** Ordered top-level bundle keys with human labels for the Publish-center diff. */
const KEY_LABELS: { key: keyof ContentBundle; label: string }[] = [
  { key: "site", label: "Site settings" },
  { key: "navigation", label: "Navigation" },
  { key: "home", label: "Homepage" },
  { key: "stats", label: "Homepage — stats" },
  { key: "statPendingNote", label: "Homepage — stats" },
  { key: "sectorsIntro", label: "Sectors — intro" },
  { key: "sectors", label: "Sectors" },
  { key: "showPendingExperience", label: "Sectors — Selected Experience" },
  { key: "pendingExperienceCard", label: "Sectors — Selected Experience" },
  { key: "company", label: "About — Company" },
  { key: "certificationsPage", label: "About — Certifications" },
  { key: "classifications", label: "About — Certifications" },
  { key: "licenses", label: "About — Certifications" },
  { key: "certifications", label: "About — Certifications" },
  { key: "clientsPage", label: "About — Clients" },
  { key: "clients", label: "About — Clients" },
  { key: "leadershipPage", label: "About — Leadership" },
  { key: "leadership", label: "About — Leadership" },
  { key: "careersPage", label: "Careers page" },
  { key: "contactPage", label: "Contact page" },
  { key: "flags", label: "Feature flags" },
];

function stable(value: unknown): string {
  return JSON.stringify(value);
}

async function computeDiff(): Promise<PublishDiffEntry[]> {
  const [draft, published] = await Promise.all([
    neonContentStore.getDraft(),
    neonContentStore.getPublished(),
  ]);
  return KEY_LABELS.map(({ key, label }) => ({
    key,
    label,
    changed: stable(draft[key]) !== stable(published[key]),
  }));
}

/**
 * Ping the Vercel deploy hook (if VERCEL_DEPLOY_HOOK_URL is set) so the live site
 * rebuilds and its prebuild step pulls the freshly-published content from Neon.
 * Optional and non-fatal — a publish still succeeds if the trigger fails.
 */
async function fireDeployHook(): Promise<void> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return;
  try {
    const res = await fetch(hook, { method: "POST" });
    if (!res.ok) console.warn(`[publish] deploy hook returned HTTP ${res.status}`);
  } catch (err) {
    console.warn("[publish] deploy hook request failed:", err);
  }
}

export const neonPublishService: PublishService = {
  diff(): Promise<PublishDiffEntry[]> {
    return computeDiff();
  },

  async publish(actor: string): Promise<PublishRecord> {
    const draft = await neonContentStore.getDraft();
    const diff = await computeDiff();
    const changedKeys = diff.filter((d) => d.changed).map((d) => d.key);

    // 1. Write the site's generated content bundle (what `next build` reads).
    await writeGeneratedContent(draft);
    // 2. Snapshot draft → published (the new "live" baseline).
    await writePublishedSnapshot(draft);

    // 3. Record publish history.
    const record: PublishRecord = {
      id: makeId("pub"),
      publishedAt: new Date().toISOString(),
      publishedBy: actor,
      summary:
        changedKeys.length > 0
          ? `Published ${changedKeys.length} change group(s).`
          : "Published (no content changes since last publish).",
      changedKeys: [...new Set(changedKeys)],
    };
    await query(
      `insert into publishes (id, published_at, published_by, summary, changed_keys)
       values ($1, $2, $3, $4, $5::jsonb)`,
      [
        record.id,
        record.publishedAt,
        record.publishedBy,
        record.summary,
        jsonbParam(record.changedKeys),
      ],
    );

    // 4. Audit.
    await neonAuditLog.append({
      actor,
      action: "publish",
      entity: "content",
      summary: record.summary,
      diff: { changedKeys: record.changedKeys },
    });

    // 5. Trigger a live rebuild — the satco-web build pulls the published bundle
    //    from Neon (prebuild fetch). Non-fatal: publish succeeds even if it fails.
    await fireDeployHook();

    return record;
  },

  async history(limit = 50): Promise<PublishRecord[]> {
    const rows = await query<PublishRow>(
      "select * from publishes order by published_at desc, seq asc limit $1",
      [limit],
    );
    return rows.map(toPublish);
  },
};
