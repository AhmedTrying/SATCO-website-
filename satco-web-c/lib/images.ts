/*
 * Pre-generated responsive variants (scripts/optimize-images.mjs) — static
 * export uses images.unoptimized, so srcsets are built from this manifest.
 * Keep in sync with public/images/.
 */
const VARIANTS: Record<string, number[]> = {
  // Option C trial: AI-generated set (docs/AI-IMAGE-BRIEF.md), built by
  // scripts/import-ai-images.mjs. Sources are ~1670px wide, so no 2200 variant.
  "airport-1": [640, 1080, 1600],
  "airport-3": [640, 1080, 1448],
  "airport-4": [640, 1080, 1600],
  "apron-1": [640, 1080, 1600],
  "tower-1": [640, 1080, 1600],
  "construction-1": [640, 1080, 1600],
  "construction-2": [640, 1080, 1600],
  "construction-3": [640, 1080, 1600],
  "team-1": [640, 1080, 1448],
  "team-2": [640, 1080, 1600],
  "ls-1": [640, 1080, 1600],
  "plant-1": [640, 1080, 1600],
  maintenance: [640, 1080],
  neom: [640, 1080, 1600],
  "highway-1": [640, 1080, 1600],
  "riyadh-1": [640, 1080, 1600],
  "riyadh-2": [640, 1080, 1600],
  // New optional slots (S6, O4, O5), not placed in any gallery yet
  "baggage-1": [640, 1080, 1600],
  "landscape-1": [640, 1080, 1600],
  "catering-1": [640, 1080, 1600],
  // Unsplash set (free license, 2026-08) — no AI replacement yet
  "terminal-1": [640, 1080, 1600, 2200],
  "terminal-2": [640, 1080, 1600, 2200],
  // SATCO photos leading the Construction / Operations / PPP galleries
  // (client folder, 2026-10-04; masters in img/, scripts/optimize-images.mjs)
  "satco-construction": [640, 1080, 1600, 2200],
  "satco-operations": [640, 1080, 1600],
  "satco-ppp": [640, 1080, 1600],
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
