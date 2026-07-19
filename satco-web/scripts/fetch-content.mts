/*
 * Prebuild: pull the PUBLISHED content bundle from Neon and write the site's
 * content/generated/*.json (the same per-section layout the dashboard publishes,
 * via the shared splitBundle). Runs automatically before `next build` through the
 * satco-web "prebuild" script.
 *
 * The committed generated JSON is the offline fallback: if DATABASE_URL is unset or
 * Neon is unreachable, this exits 0 WITHOUT touching the files, so the build never
 * breaks. Set DATABASE_URL in the Vercel project (satco-website) to make each build
 * reflect the latest published content; the dashboard's Publish fires a deploy hook
 * that triggers that rebuild. See docs/NEON-SWAP.md.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { splitBundle } from "@satco/shared";
import type { ContentBundle } from "@satco/shared";

const url = process.env.DATABASE_URL;
if (!url) {
  console.log("[fetch-content] DATABASE_URL not set — using committed generated JSON.");
  process.exit(0);
}

try {
  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(url);
  const rows = (await sql.query(
    "select data from content_bundle where status = 'published'",
  )) as { data: ContentBundle }[];

  if (!rows.length) {
    console.log("[fetch-content] no published row in Neon — using committed JSON.");
    process.exit(0);
  }

  const dir = fileURLToPath(new URL("../content/generated/", import.meta.url));
  mkdirSync(dir, { recursive: true });
  const files = splitBundle(rows[0].data);
  for (const [name, data] of Object.entries(files)) {
    writeFileSync(dir + name, JSON.stringify(data, null, 2) + "\n", "utf8");
  }
  console.log(
    `[fetch-content] wrote ${Object.keys(files).length} section files from Neon (published).`,
  );
} catch (err) {
  // Never break the build — fall back to the committed generated JSON.
  console.log(
    "[fetch-content] Neon fetch failed — using committed JSON. " +
      (err instanceof Error ? err.message : String(err)),
  );
  process.exit(0);
}
