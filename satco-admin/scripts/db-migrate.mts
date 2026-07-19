/*
 * db:migrate — apply satco-admin/db/schema.sql to the Neon database (idempotent).
 *
 * Run:  npm run db:migrate       (from repo root; uses tsx)
 *
 * Reads DATABASE_URL from satco-admin/.env.local, falling back to the ambient
 * environment (e.g. CI, or Vercel env). The schema uses only plain DDL (no
 * dollar-quoted bodies), so splitting on ';' after stripping line comments is safe.
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

const schemaPath = fileURLToPath(new URL("../db/schema.sql", import.meta.url));
const statements = readFileSync(schemaPath, "utf8")
  .split("\n")
  .map((line) => line.replace(/--.*$/, ""))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

let applied = 0;
for (const statement of statements) {
  await sql.query(statement);
  applied += 1;
}

console.log(`db:migrate — applied ${applied} statements to Neon.`);

/** Load KEY=VALUE pairs from satco-admin/.env.local without overriding ambient env. */
function loadEnvLocal() {
  let text: string;
  try {
    text = readFileSync(fileURLToPath(new URL("../.env.local", import.meta.url)), "utf8");
  } catch {
    return; // No .env.local — rely on the ambient environment.
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
