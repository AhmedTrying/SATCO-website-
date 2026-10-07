import type { PendingExperienceCard, SectorsIntroContent } from "@satco/shared";

import type { ImageRef, Sector, SectorSlug } from "@/lib/types";
import data from "./generated/sectors.json";

/*
 * Sectors — sourced from the generated JSON.
 *
 * "Selected Experience" for Construction / Operations / PPP is pending a client
 * go/no-go (plan §12 Q4): the verbatim draft copy is carried with status
 * 'pending-decision' and the UI renders the interim card until
 * showPendingExperience is flipped from the dashboard's sectors switch.
 *
 * Option C (user decision 2026-10-04): every sector page follows the Airports
 * structure, so C publishes that draft copy (overriding the shared switch),
 * leads the Construction / Operations / PPP galleries with a SATCO photo (3
 * images → the same mosaic as Airports) and gives each sector the Airports
 * pair of figure cards. See docs/VARIANTS.md.
 */
export const showPendingExperience = true;

export const pendingExperienceCard =
  data.pendingExperienceCard as unknown as PendingExperienceCard;

/** C: SATCO photo that leads each gallery (client folder, public/images). */
const C_LEAD_PHOTO: Partial<Record<SectorSlug, ImageRef>> = {
  construction: {
    src: "satco-construction",
    alt: "SATCO residential buildings under construction in a construction village",
  },
  operations: {
    src: "satco-operations",
    alt: "Landscaped pool and recreation area in a SATCO-operated residential village",
  },
  ppp: {
    src: "satco-ppp",
    alt: "Aerial view of a SATCO residential community in a mountain valley",
  },
};

export const sectors = (data.sectors as unknown as Sector[]).map((sector) => {
  const lead = C_LEAD_PHOTO[sector.slug];
  return lead ? { ...sector, gallery: [lead, ...(sector.gallery ?? [])] } : sector;
});

export type ExperienceFigure = { value: string; label: string };

/*
 * C: the two figure cards beside "Selected experience". Airports keeps A's
 * pair; the others quote figures from their own experience copy (user
 * decision 2026-10-04). "~800" villas differs from "SATCO in Numbers.xlsx"
 * (388 villas), which counts residential construction differently.
 */
export const experienceFigures: Partial<Record<SectorSlug, [ExperienceFigure, ExperienceFigure]>> = {
  airports: [
    { value: "130+", label: "Passenger boarding bridges installed" },
    { value: "9", label: "Airports supported" },
  ],
  construction: [
    { value: "~800", label: "Villas in a government housing development" },
    { value: "~25,000", label: "Residents across NEOM construction villages" },
  ],
  operations: [
    { value: "1M+", label: "sqm of industrial residential developments maintained" },
    { value: "10,000+", label: "Residents in operated residential villages" },
  ],
  ppp: [
    { value: "10,000", label: "Beds at NEOM Residential Communities 9" },
    { value: "250,000", label: "m³/day treatment capacity target at Hadda ISTP" },
  ],
};

export const sectorsIntro = data.sectorsIntro as unknown as SectorsIntroContent;

export function getSector(slug: string) {
  return sectors.find((s) => s.slug === slug);
}
