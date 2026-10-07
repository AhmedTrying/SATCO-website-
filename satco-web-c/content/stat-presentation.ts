import type { ImageRef } from "@/lib/types";

/** OPT-03 C presentation labels and existing client photography. Stat data stays shared. */
export const statPresentation: Record<"construction" | "airports", { title: string; photo: ImageRef }> = {
  construction: {
    title: "Construction & Communities",
    photo: { src: "construction-1", alt: "Aerial view of a SATCO-built integrated residential community" },
  },
  airports: {
    title: "Airports",
    photo: { src: "airport-4", alt: "SATCO passenger boarding bridges on an airport apron" },
  },
};
