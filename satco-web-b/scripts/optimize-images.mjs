/*
 * Pre-generates responsive image variants (plan §8/P7): static export uses
 * images.unoptimized, so width variants are built ahead of time and referenced
 * via <picture>/srcset. Source: the repo-root img/ set mapped from client
 * photography. Run: node scripts/optimize-images.mjs [name ...]
 *
 * Option B: a master in this option's own img/ folder wins over the shared
 * repo-root one. B uses it to swap the Unsplash stock set for SATCO's own
 * photos (client folder, 2026-10-04; see docs/VARIANTS.md). Pass names to
 * regenerate only those images.
 */
import { existsSync } from "node:fs";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(process.cwd(), "../img");
const LOCAL_SRC = path.resolve(process.cwd(), "img");
const OUT = path.resolve(process.cwd(), "public/images");
// 2800 only reaches sources that wide (B: who-panorama).
const WIDTHS = [640, 1080, 1600, 2200, 2800];
const IMAGES = [
  "airport-1",
  "airport-3",
  "airport-4",
  "construction-1",
  "ls-1",
  "maintenance",
  "neom",
  // Unsplash set (free license, 2026-08) — sourced to fill the imagery gap
  "terminal-1",
  "terminal-2",
  "apron-1",
  "tower-1",
  "construction-2",
  "construction-3",
  "team-1",
  "team-2",
  "riyadh-1",
  "riyadh-2",
  "highway-1",
  "plant-1",
  // Option B: home "Who we are" panorama band (client folder, 2026-10-04)
  "who-panorama",
];

await mkdir(OUT, { recursive: true });

const only = process.argv.slice(2);
for (const name of only.length ? IMAGES.filter((n) => only.includes(n)) : IMAGES) {
  const local = path.join(LOCAL_SRC, `${name}.jpg`);
  const src = existsSync(local) ? local : path.join(SRC, `${name}.jpg`);
  const meta = await sharp(src).metadata();
  for (const w of WIDTHS) {
    if (meta.width && meta.width < w) continue;
    const base = path.join(OUT, `${name}-${w}`);
    const resized = sharp(src).resize(w).rotate();
    await resized.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
    await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}.jpg`);
    const s = await stat(`${base}.webp`);
    console.log(`${name}-${w}.webp ${(s.size / 1024).toFixed(0)}KB`);
  }
}
console.log("done");
