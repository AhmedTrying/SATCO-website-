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

/*
 * Option B: the stock image names now hold SATCO's own photos (public/images,
 * see docs/VARIANTS.md), so their shared alt text is replaced here to describe
 * what B actually shows. Keyed by image name; everything else stays shared.
 */
const B_PHOTO_ALT: Record<string, string> = {
  "apron-1": "An aircraft with its tow tractor at a SATCO passenger boarding bridge",
  "tower-1": "SATCO passenger boarding bridges at an airport terminal, with the control tower behind",
  "construction-2": "Aerial view of a SATCO construction village being built",
  "construction-3": "SATCO crew placing a steel beam on a structure under construction",
  "team-1": "SATCO site crew working on a foundation pour",
  "plant-1": "Landscaped plaza with palms and shade structures maintained by SATCO",
  "team-2": "SATCO staff forming the SATCO name on a sports field",
  "highway-1": "Aerial view of a SATCO residential community in a mountain valley",
  "riyadh-1": "Aerial view of a large SATCO construction village",
};

function withBAlt<T extends { src: string; alt: string }>(image: T): T {
  const alt = B_PHOTO_ALT[image.src];
  return alt ? { ...image, alt } : image;
}

export const sectors = (data.sectors as unknown as Sector[]).map((sector) => ({
  ...sector,
  card: withBAlt(sector.card),
  hero: withBAlt(sector.hero),
  gallery: sector.gallery?.map(withBAlt),
}));

export const sectorsIntro = data.sectorsIntro as unknown as SectorsIntroContent;

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
