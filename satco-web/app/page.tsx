import { SectorSlider } from "@/components/home/SectorSlider";
import { StatBand } from "@/components/home/StatBand";
import { WhoWeAre } from "@/components/home/WhoWeAre";
import { SectorsOverview } from "@/components/home/SectorsOverview";
import { CareersTeaser } from "@/components/home/CareersTeaser";
import { ContactTeaser } from "@/components/home/ContactTeaser";
import { flags } from "@/content/flags";

/*
 * Home — single scroll per the approved design. LOCKED: hero and Operating
 * Sectors remain separate sections (docx comments #6/#9). Optional sections are
 * gated by the section_visibility feature flags (all on by default).
 */
export default function Home() {
  const v = flags.section_visibility;
  return (
    <>
      <section aria-labelledby="home-h1">
        <SectorSlider />
      </section>
      {v.statBand && <StatBand />}
      {v.whoWeAre && <WhoWeAre />}
      <SectorsOverview />
      {v.careersTeaser && <CareersTeaser />}
      {v.contactTeaser && <ContactTeaser />}
    </>
  );
}
