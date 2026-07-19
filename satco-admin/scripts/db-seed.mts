/*
 * db:seed — load satco-admin/data/seed/*.json into the Neon database.
 *
 * Run:  npm run db:seed          (from repo root; uses tsx, after db:migrate)
 *
 * Idempotent: every row is inserted with `on conflict (id) do nothing`, so re-running
 * never clobbers edits made in the dashboard. To reset a table, TRUNCATE it first.
 * Regenerate the seed JSON itself from the site content with `npm run seed`.
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
const seedDir = fileURLToPath(new URL("../data/seed/", import.meta.url));
const readJson = (name: string) => JSON.parse(readFileSync(seedDir + name, "utf8"));

// [dbColumn, sourceKey, isJsonb?]
type Col = [string, string, boolean?];

async function seedTable(table: string, cols: Col[], rows: Record<string, unknown>[]) {
  for (const row of rows) {
    const dbCols = cols.map((c) => c[0]);
    const placeholders = cols.map((c, i) => (c[2] ? `$${i + 1}::jsonb` : `$${i + 1}`));
    const values = cols.map((c) => {
      const v = row[c[1]];
      if (c[2]) return JSON.stringify(v ?? null);
      return v ?? null;
    });
    await sql.query(
      `insert into ${table} (${dbCols.join(", ")}) values (${placeholders.join(", ")})
       on conflict (id) do nothing`,
      values,
    );
  }
  const [{ count }] = await sql.query(`select count(*)::int as count from ${table}`);
  console.log(`  ${table.padEnd(22)} -> ${count} rows`);
}

console.log("db:seed — loading data/seed/*.json into Neon:");

await seedTable(
  "users",
  [
    ["id", "id"],
    ["name", "name"],
    ["email", "email"],
    ["role", "role"],
    ["active", "active"],
    ["created_at", "createdAt"],
  ],
  readJson("users.json"),
);

await seedTable(
  "jobs",
  [
    ["id", "id"],
    ["slug", "slug"],
    ["title", "title"],
    ["location", "location"],
    ["sector", "sector"],
    ["discipline", "discipline"],
    ["experience_level", "experienceLevel"],
    ["type", "type"],
    ["posted_at", "postedAt"],
    ["summary", "summary"],
    ["responsibilities", "responsibilities", true],
    ["requirements", "requirements", true],
    ["apply_href", "applyHref"],
    ["source", "source"],
    ["state", "state"],
    ["created_at", "createdAt"],
    ["updated_at", "updatedAt"],
  ],
  readJson("jobs.json"),
);

await seedTable(
  "contact_submissions",
  [
    ["id", "id"],
    ["name", "name"],
    ["email", "email"],
    ["organization", "organization"],
    ["inquiry_type", "inquiryType"],
    ["message", "message"],
    ["assigned_dept", "assignedDept"],
    ["status", "status"],
    ["assignee", "assignee"],
    ["created_at", "createdAt"],
  ],
  readJson("submissions.json"),
);

await seedTable(
  "job_applications",
  [
    ["id", "id"],
    ["job_id", "jobId"],
    ["job_title", "jobTitle"],
    ["applicant_name", "applicantName"],
    ["email", "email"],
    ["phone", "phone"],
    ["cv_media_id", "cvMediaId"],
    ["cover_note", "coverNote"],
    ["status", "status"],
    ["created_at", "createdAt"],
  ],
  readJson("applications.json"),
);

await seedTable(
  "general_applications",
  [
    ["id", "id"],
    ["applicant_name", "applicantName"],
    ["email", "email"],
    ["phone", "phone"],
    ["discipline", "discipline"],
    ["sector", "sector"],
    ["cv_media_id", "cvMediaId"],
    ["note", "note"],
    ["status", "status"],
    ["created_at", "createdAt"],
  ],
  readJson("general-applications.json"),
);

await seedTable(
  "media",
  [
    ["id", "id"],
    ["path", "path"],
    ["filename", "filename"],
    ["alt", "alt"],
    ["bucket", "bucket"],
    ["mime_type", "mimeType"],
    ["size_bytes", "sizeBytes"],
    ["width", "width"],
    ["height", "height"],
    ["category", "category"],
    ["uploaded_at", "uploadedAt"],
    ["uploaded_by", "uploadedBy"],
  ],
  readJson("media.json"),
);

await seedTable(
  "audit_log",
  [
    ["id", "id"],
    ["ts", "ts"],
    ["actor", "actor"],
    ["action", "action"],
    ["entity", "entity"],
    ["entity_id", "entityId"],
    ["summary", "summary"],
    ["diff", "diff", true],
  ],
  readJson("audit.json"),
);

// Content bundle: seed BOTH draft and published from the committed content seed so a
// fresh DB reflects the live site (the Publish center shows no phantom diff).
const content = readJson("content.json");
for (const status of ["draft", "published"]) {
  await sql.query(
    `insert into content_bundle (status, data, updated_by) values ($1, $2::jsonb, $3)
     on conflict (status) do nothing`,
    [status, JSON.stringify(content), "seed"],
  );
}
const [{ count: cb }] = await sql.query(
  "select count(*)::int as count from content_bundle",
);
console.log(`  content_bundle         -> ${cb} rows (draft + published)`);

console.log("db:seed — done.");

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
