/*
 * Option C trial of the AI-generated imagery (docs/AI-IMAGE-BRIEF.md).
 * Reads the PNGs in ../Images/AI Generated Pics and writes them over C's
 * existing slots under the same names, so content/ and alt texts are
 * untouched. Photo slots get 640/1080/1600 variants (never upscaled; the
 * source width is added when it is well above the last standard width);
 * stale variants of the replaced slots are removed. Update VARIANTS in
 * lib/images.ts from the printed widths.
 * Run from satco-web-c/: node scripts/import-ai-images.mjs
 */
import { readdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve(process.cwd(), "../Images/AI Generated Pics");
const OUT = path.resolve(process.cwd(), "public/images");
const WIDTHS = [640, 1080, 1600, 2200];

// slot name → source file
const PHOTOS = {
  "airport-1": "airport-1 (hero).png",
  "airport-3": "airport-3 (gallery).png",
  "airport-4": "airport-4 (card).png",
  "apron-1": "apron-1 (gallery).png",
  "tower-1": "tower-1 (gallery).png",
  "construction-1": "construction-1.png",
  "construction-2": "construction-2 (card).png",
  "construction-3": "construction-3 (gallery).png",
  "team-1": "team-1 (gallery).png",
  "team-2": "team-2 (gallery).png",
  "ls-1": "ls-1 (hero).png",
  "plant-1": "plant-1 (card + gallery).png",
  maintenance: "maintenance.png",
  neom: "neom (hero).png",
  "highway-1": "highway-1 (card + gallery).png",
  "riyadh-1": "riyadh-1 (gallery).png",
  "riyadh-2": "riyadh-2.png",
  // New optional slots (S6, O4, O5): generated, not yet placed in any gallery.
  "baggage-1": "baggage-1.png",
  "landscape-1": "(new, optional) landscape-1.png",
  "catering-1": "(new, optional) catering-1.png",
};

const existing = await readdir(OUT);

// The exported file names contain non-breaking spaces; match on normalised names.
const sources = await readdir(SRC);
const norm = (s) => s.replace(/\s/g, " ");
function source(file) {
  const hit = sources.find((f) => norm(f) === norm(file));
  if (!hit) throw new Error(`Missing source image: ${file}`);
  return path.join(SRC, hit);
}

for (const [name, file] of Object.entries(PHOTOS)) {
  const src = source(file);
  const { width } = await sharp(src).metadata();
  const widths = WIDTHS.filter((w) => w <= width);
  if (width - widths[widths.length - 1] > 200) widths.push(width);

  const stale = new RegExp(`^${name}-\\d+\\.(jpg|webp)$`);
  for (const f of existing.filter((f) => stale.test(f))) await unlink(path.join(OUT, f));

  for (const w of widths) {
    const base = path.join(OUT, `${name}-${w}`);
    const resized = sharp(src).resize(w);
    await resized.clone().webp({ quality: 78 }).toFile(`${base}.webp`);
    await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}.jpg`);
  }
  console.log(`"${name}": [${widths.join(", ")}],`);
}

// Footer skyline: C's SkylineContinuation and the footer both assume the old
// 3:2 artwork, so the 3:1 panorama is padded with its own top rows (sky) to 3:2.
{
  const W = 1536;
  const panorama = await sharp(source("footer-riyadh-skyline.webp.png"))
    .resize(W)
    .toBuffer({ resolveWithObject: true });
  const pad = Math.round((W * 2) / 3) - panorama.info.height;
  await sharp(panorama.data)
    .extend({ top: pad, extendWith: "copy" })
    .webp({ quality: 78 })
    .toFile(path.join(OUT, "footer-riyadh-skyline.webp"));
  console.log(`footer-riyadh-skyline.webp ${W}x${panorama.info.height + pad}`);
}

// Careers role line art: transparent PNG, background of job detail/apply pages.
await sharp(source("careers-role-line-art.png.png"))
  .png({ palette: true, quality: 90, compressionLevel: 9 })
  .toFile(path.join(OUT, "careers-role-line-art.png"));
console.log("careers-role-line-art.png");
