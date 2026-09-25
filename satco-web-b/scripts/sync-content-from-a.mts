/*
 * Variant content sync: Options B and C share Option A's content. Copies
 * satco-web/content/generated/*.json (what the dashboard publishes locally) into
 * this variant's content/generated/ before dev and build. In production the
 * prebuild Neon fetch that runs next overwrites these files with the same
 * published bundle, so all three sites always show identical content.
 *
 * Never breaks dev/build: if Option A's folder is missing, it keeps the
 * committed JSON. See docs/VARIANTS.md.
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = fileURLToPath(new URL("../../satco-web/content/generated/", import.meta.url));
const target = fileURLToPath(new URL("../content/generated/", import.meta.url));

if (!existsSync(source)) {
  console.log("[sync-content] Option A content not found — using committed JSON.");
  process.exit(0);
}

mkdirSync(target, { recursive: true });
const files = readdirSync(source).filter((name) => name.endsWith(".json"));
for (const name of files) copyFileSync(source + name, target + name);
console.log(`[sync-content] copied ${files.length} section files from Option A.`);
