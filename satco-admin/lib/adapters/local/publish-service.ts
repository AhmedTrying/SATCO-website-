/*
 * Local PublishService — the working link to the site (dashboard kickoff §2.2 / §3).
 *
 * publish() snapshots the draft → published, writes the site's generated content
 * JSON (satco-web/content/generated/content.json), and records audit + publish
 * history. Rebuild stays manual: `npm run build` in satco-web picks up the JSON.
 * TODO(supabase): flip row status + fire a debounced deploy hook instead.
 */

import type { ContentBundle, PublishRecord } from "@satco/shared";

import type { PublishDiffEntry, PublishService } from "../types";
import { localAuditLog } from "./audit-log";
import { localContentStore, writePublishedSnapshot } from "./content-store";
import { makeId, readStore, writeGeneratedContent, writeStore } from "./store";

const HISTORY = "publishes.json";

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
    localContentStore.getDraft(),
    localContentStore.getPublished(),
  ]);
  return KEY_LABELS.map(({ key, label }) => ({
    key,
    label,
    changed: stable(draft[key]) !== stable(published[key]),
  }));
}

export const localPublishService: PublishService = {
  diff(): Promise<PublishDiffEntry[]> {
    return computeDiff();
  },

  async publish(actor: string): Promise<PublishRecord> {
    const draft = await localContentStore.getDraft();
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
    const history = await readStore<PublishRecord[]>(HISTORY).catch(() => [] as PublishRecord[]);
    history.unshift(record);
    await writeStore(HISTORY, history);

    // 4. Audit.
    await localAuditLog.append({
      actor,
      action: "publish",
      entity: "content",
      summary: record.summary,
      diff: { changedKeys: record.changedKeys },
    });

    return record;
  },

  async history(limit = 50): Promise<PublishRecord[]> {
    const history = await readStore<PublishRecord[]>(HISTORY).catch(() => [] as PublishRecord[]);
    return history.slice(0, limit);
  },
};
