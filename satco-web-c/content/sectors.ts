import type { PendingExperienceCard, SectorsIntroContent } from "@satco/shared";

import type { Sector } from "@/lib/types";
import data from "./generated/sectors.json";

/*
 * Sectors — sourced from the generated JSON.
 *
 * "Selected Experience" for Construction / Operations / PPP is pending a client
 * go/no-go (plan §12 Q4): the verbatim draft copy is carried with status
 * 'pending-decision' and the UI renders the interim card until
 * showPendingExperience is flipped from the dashboard's sectors switch.
 */
export const showPendingExperience: boolean = data.showPendingExperience;

export const pendingExperienceCard =
  data.pendingExperienceCard as unknown as PendingExperienceCard;

export const sectors = data.sectors as unknown as Sector[];

export const sectorsIntro = data.sectorsIntro as unknown as SectorsIntroContent;

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
