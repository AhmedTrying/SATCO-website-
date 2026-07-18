import type { FeatureFlags } from "@satco/shared";

import data from "./generated/flags.json";

/*
 * Build-time feature flags — sourced from the generated JSON the dashboard
 * publishes (plan §8, dashboard kickoff §6). Flags that affect layout/SEO are
 * baked in at build time (section visibility, review control, loading duration,
 * pending experience, vendor tab); operational flags (maintenance banner) are
 * read the same way for the static export.
 */
export const flags = data as unknown as FeatureFlags;
