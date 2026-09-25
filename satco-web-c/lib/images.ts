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
  // Unsplash set (free license, 2026-08)
  "terminal-1": [640, 1080, 1600, 2200],
  "terminal-2": [640, 1080, 1600, 2200],
  "apron-1": [640, 1080, 1600, 2200],
  "tower-1": [640, 1080, 1600, 2200],
  "construction-2": [640, 1080, 1600, 2200],
  "construction-3": [640, 1080, 1600, 2200],
  "team-1": [640, 1080, 1600, 2200],
  "team-2": [640, 1080, 1600, 2200],
  "riyadh-1": [640, 1080, 1600, 2200],
  "riyadh-2": [640, 1080, 1600],
  "highway-1": [640, 1080, 1600, 2200],
  "plant-1": [640, 1080, 1600, 2200],
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
