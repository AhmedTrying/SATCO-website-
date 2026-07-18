/*
 * Local JSON store — the filesystem stand-in for Supabase tables.
 * Reads prefer the mutable store (data/store/); on first read they fall back to
 * the committed seed (data/seed/) so a fresh checkout works without a rebuild.
 * Writes always go to data/store/ (gitignored). Replaced wholesale by Postgres
 * later — every consumer goes through the adapter interfaces, not these paths.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ContentBundle } from "@satco/shared";

// process.cwd() is the satco-admin project dir under `next dev`/`next build`.
const ADMIN_ROOT = process.cwd();
const SEED_DIR = path.join(ADMIN_ROOT, "data", "seed");
const STORE_DIR = path.join(ADMIN_ROOT, "data", "store");

/** The site's generated-content directory (the DA3 publish target). */
export const GENERATED_DIR = path.join(
  ADMIN_ROOT,
  "..",
  "satco-web",
  "content",
  "generated",
);

/**
 * Split the in-memory bundle into the per-section JSON files satco-web imports
 * (kickoff §2.2: content/generated/*.json). Each file maps 1:1 to a content/*.ts
 * module's exports so the site tree-shakes per page — no whole-bundle bloat.
 * This mapping is the single source of truth for the site↔dashboard file layout.
 */
export function splitBundle(b: ContentBundle): Record<string, unknown> {
  return {
    "site.json": b.site,
    "home.json": b.home,
    "stats.json": { statPendingNote: b.statPendingNote, stats: b.stats },
    "navigation.json": b.navigation,
    "company.json": b.company,
    "certifications.json": {
      certificationsPage: b.certificationsPage,
      classifications: b.classifications,
      licenses: b.licenses,
      certifications: b.certifications,
    },
    "clients.json": { clientsPage: b.clientsPage, clients: b.clients },
    "leadership.json": { leadershipPage: b.leadershipPage, leadership: b.leadership },
    "contact.json": b.contactPage,
    "careers.json": b.careersPage,
    "sectors.json": {
      showPendingExperience: b.showPendingExperience,
      pendingExperienceCard: b.pendingExperienceCard,
      sectors: b.sectors,
      sectorsIntro: b.sectorsIntro,
    },
    "flags.json": b.flags,
  };
}

export async function readStore<T>(name: string): Promise<T> {
  const storePath = path.join(STORE_DIR, name);
  try {
    return JSON.parse(await fs.readFile(storePath, "utf8")) as T;
  } catch {
    // Fall back to the committed seed (first run / never mutated).
    const seedPath = path.join(SEED_DIR, name);
    return JSON.parse(await fs.readFile(seedPath, "utf8")) as T;
  }
}

/** Read ONLY the committed seed, ignoring any mutable store copy. */
export async function readSeed<T>(name: string): Promise<T> {
  return JSON.parse(await fs.readFile(path.join(SEED_DIR, name), "utf8")) as T;
}

export async function writeStore(name: string, data: unknown): Promise<void> {
  await fs.mkdir(STORE_DIR, { recursive: true });
  const tmp = path.join(STORE_DIR, `.${name}.tmp`);
  const dest = path.join(STORE_DIR, name);
  const body = JSON.stringify(data, null, 2) + "\n";
  // Write-then-rename for atomicity (avoids a torn file if two writes race).
  await fs.writeFile(tmp, body, "utf8");
  await fs.rename(tmp, dest);
}

/** Write the site's generated per-section JSON (creates content/generated/ if needed). */
export async function writeGeneratedContent(bundle: ContentBundle): Promise<void> {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  const files = splitBundle(bundle);
  for (const [name, data] of Object.entries(files)) {
    await fs.writeFile(
      path.join(GENERATED_DIR, name),
      JSON.stringify(data, null, 2) + "\n",
      "utf8",
    );
  }
}

/** Short, collision-resistant id without pulling in a uuid dep. */
export function makeId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  const t = Date.now().toString(36);
  return `${prefix}-${t}${rand}`;
}
