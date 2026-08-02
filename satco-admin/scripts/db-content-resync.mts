/*
 * db:content-resync — overwrite the Neon content_bundle rows (draft AND
 * published) with the current satco-admin/data/seed/content.json.
 *
 * Run:  npm run db:content-resync   (from repo root; regenerate the seed
 *       first with `npm run seed` so it reflects satco-web/content)
 *
 * Unlike db:seed (insert-only, `on conflict do nothing`), this UPDATES the
 * existing bundle rows — use it when the repo's content has moved ahead of
 * the database (e.g. content edited directly in the repo), otherwise the
 * next dashboard Publish reverts the site to the stale draft. Touches ONLY
 * content_bundle; users/jobs/submissions/media/audit are left alone.
 * DISCARDS any unpublished dashboard draft edits — check the Publish center
 * for pending changes before running.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { neon } from "@neondatabase/serverless";

loadEnvLocal();

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL is not set. Add it to satco-admin/.env.local (see .env.example).",
  );
}

const sql = neon(url);
const content = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/seed/content.json", import.meta.url)), "utf8"),
);

for (const status of ["draft", "published"]) {
  const rows = await sql.query(
    `update content_bundle set data = $2::jsonb, updated_by = $3, updated_at = now()
     where status = $1 returning status`,
    [status, JSON.stringify(content), "db:content-resync"],
  );
  console.log(`  content_bundle ${status.padEnd(9)} -> ${rows.length} row updated`);
}

const [probe] = await sql.query(
  `select jsonb_array_length(data->'clients') as clients,
          (data->'home'->'statBand'->>'lede') is not null as has_lede,
          (data->'contactPage'->>'mapEmbedUrl') as map
   from content_bundle where status = 'draft'`,
);
console.log("db:content-resync — draft probe:", JSON.stringify(probe));

/** Load KEY=VALUE pairs from satco-admin/.env.local without overriding ambient env. */
function loadEnvLocal() {
  let text: string;
  try {
    text = readFileSync(fileURLToPath(new URL("../.env.local", import.meta.url)), "utf8");
  } catch {
    return;
  }
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    let value = rawValue;
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
