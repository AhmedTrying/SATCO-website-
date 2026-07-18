import type { Metadata } from "next";
import { getSector } from "@/content/sectors";
import { SectorL2 } from "@/components/sectors/SectorL2";

const sector = getSector("construction")!;

export const metadata: Metadata = {
  title: sector.name,
  description: sector.tagline,
};

export default function ConstructionPage() {
  return <SectorL2 sector={sector} />;
}
