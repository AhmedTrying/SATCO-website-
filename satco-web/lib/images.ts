/*
 * Pre-generated responsive variants (scripts/optimize-images.mjs) — static
 * export uses images.unoptimized, so srcsets are built from this manifest.
 * Keep in sync with public/images/.
 */
const VARIANTS: Record<string, number[]> = {
  "airport-1": [640, 1080, 1600, 2200],
  "airport-3": [640, 1080, 1600, 2200],
  "airport-4": [640, 1080, 1600, 2200],
  "construction-1": [640, 1080, 1600],
  "ls-1": [640, 1080, 1600],
  // ⚠ small portrait source (886×1195) — flagged as an imagery gap (plan §12 Q9)
  maintenance: [640, 886],
  neom: [640, 1080, 1600],
};

export function widthsFor(base: string): number[] {
  return VARIANTS[base] ?? [];
}

export function srcSetFor(base: string, ext: "webp" | "jpg"): string {
  return widthsFor(base)
    .map((w) => `/images/${base}-${w}.${ext} ${w}w`)
    .join(", ");
}

export function fallbackSrc(base: string): string {
  const widths = widthsFor(base);
  const w = widths.includes(1080) ? 1080 : widths[widths.length - 1];
  return `/images/${base}-${w}.jpg`;
}
