import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/content/company";
import { sectors } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";

export const metadata: Metadata = {
  title: "Company information",
  description:
    "Established in 1975, SATCO has evolved from a traditional contractor into a fully integrated infrastructure and services platform.",
};

/*
 * Company Information — approved docx copy verbatim (LongForm). The design's
 * representative copy, milestones timeline, and operating-model blurb are NOT
 * reproduced: the timeline dates were invented content (kickoff §8).
 */
export default function CompanyPage() {
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Company information" },
        ]}
        title="Company information"
        headingId="company-h"
      />
      <section className="bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <Eyebrow className="mb-4">{company.eyebrow}</Eyebrow>
            <h2 className="mb-5 mt-0 max-w-[22ch] font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong">
              {company.heading}
            </h2>
            {company.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mb-[18px] mt-0 max-w-[66ch] text-base leading-[1.72] text-stone-700 last:mb-0">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={100}>
            <Picture
              image={company.image}
              sizes="(min-width: 1024px) 520px, 100vw"
              imgClassName="mb-4 w-full rounded-lg object-cover"
              style={{ height: "clamp(240px,32vw,360px)" }}
            />
            <div className="grid grid-cols-2 gap-3.5">
              {company.facts.map((fact) => (
                <div key={fact.label} className="rounded-[10px] border border-border bg-sand p-5">
                  <div className="font-display text-[1.9rem] font-bold leading-none text-bronze-800 tabular-nums">
                    {fact.value}
                  </div>
                  <div className="mt-1.5 text-[13px] text-stone-600">{fact.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
      <section aria-labelledby="model-h" className="border-t border-border bg-sand">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <h2
              id="model-h"
              className="mb-[26px] mt-0 font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong"
            >
              {company.sectorsLinkHeading}
            </h2>
          </Reveal>
          <Reveal delay={90} className="flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <Link
                key={sector.slug}
                href={`/sectors/${sector.slug}`}
                className="rounded-[100px] border border-bronze-200 bg-surface px-[18px] py-2.5 text-sm font-semibold text-bronze-800 no-underline transition-colors hover:border-bronze-800 hover:text-bronze-800"
              >
                {sector.name}
              </Link>
            ))}
          </Reveal>
        </Container>
      </section>
    </>
  );
}
