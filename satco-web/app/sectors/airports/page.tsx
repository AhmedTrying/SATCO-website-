import type { Metadata } from "next";
import { getSector } from "@/content/sectors";
import { SectorL2 } from "@/components/sectors/SectorL2";

const sector = getSector("airports")!;

export const metadata: Metadata = {
  title: sector.name,
  description: sector.tagline,
};

export default function AirportsPage() {
  return <SectorL2 sector={sector} />;
}
