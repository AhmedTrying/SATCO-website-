/*
 * Pre-generates responsive image variants (plan §8/P7): static export uses
 * images.unoptimized, so width variants are built ahead of time and referenced
 * via <picture>/srcset. Source: the repo-root img/ set mapped from client
 * photography. Run: node scripts/optimize-images.mjs
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(process.cwd(), "../img");
const OUT = path.resolve(process.cwd(), "public/images");
const WIDTHS = [640, 1080, 1600, 2200];
const IMAGES = [
  "airport-1",
  "airport-3",
  "airport-4",
  "construction-1",
  "ls-1",
  "maintenance",
  "neom",
];

await mkdir(OUT, { recursive: true });

for (const name of IMAGES) {
  const src = path.join(SRC, `${name}.jpg`);
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
