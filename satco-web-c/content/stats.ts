import type { Stat } from "@/lib/types";

import data from "./generated/stats.json";

/** Screen-reader text for the pending stat #3 placeholder. */
export const statPendingNote: string = data.statPendingNote;

/*
 * Home stat band, from the generated JSON (edited in code since the dashboard
 * CMS was retired). Stat #3 ("assets") carries the client's figure from
 * "SATCO in Numbers.xlsx" (388 villas, FIX-18, 2026-10-07); figures are client
 * data only, never invented.
 */
export const stats = data.stats as unknown as Stat[];
