import type { Stat } from "@/lib/types";

import data from "./generated/stats.json";

/** Screen-reader text for the pending stat #3 placeholder. */
export const statPendingNote: string = data.statPendingNote;

/*
 * Home stat band. Stat #3 has NO figure (value null) — NEVER invent one.
 * Sourced from the generated JSON (published from the dashboard).
 */
export const stats = data.stats as unknown as Stat[];
