import type { Stat } from "@/lib/types";

import data from "./generated/stats.json";

/** Screen-reader text for the pending stat #3 placeholder. */
export const statPendingNote: string = data.statPendingNote;

/*
 * Home stat band. Stat #3 has NO figure (value null) — NEVER invent one.
 * Sourced from the generated JSON (published from the dashboard).
 *
 * Option B: the figures and labels come from the client's "SATCO in Numbers.xlsx"
 * (website feedback folder, received 2026-10-04), wording from its "Suggested"
 * column. Same six slots, ids and order as A, so the band's structure and icons
 * are unchanged. Stat #3 ("assets") carries the sheet's villa count. The sheet's
 * other rows have no slot: 9 accommodations (LSA), 41,437 beds, 11 educational
 * institutions, 3M+ sqm BUA. See docs/VARIANTS.md.
 */
const B_FIGURES: Record<string, Partial<Stat>> = {
  communities: { label: "Construction Villages", value: 6, display: "6", suffix: undefined, decimals: undefined },
  population: { label: "Persons Served Per Day", value: 108, display: "108K+", suffix: "K+", decimals: undefined },
  assets: { label: "Villas", value: 388, display: "388", suffix: undefined, decimals: undefined },
  environments: { label: "sqm Designated Plot", value: 4.8, display: "4.8M+", suffix: "M+", decimals: 1 },
  aircrafts: { label: "Aircraft", value: 1.3, display: "1.3M+", suffix: "M+", decimals: 1 },
  airports: { label: "Airports", value: 9, display: "9", suffix: undefined, decimals: undefined },
};

export const stats = (data.stats as unknown as Stat[]).map((stat) => {
  const figure = B_FIGURES[stat.id];
  return figure ? { ...stat, ...figure, unit: undefined, countUp: true } : stat;
});
