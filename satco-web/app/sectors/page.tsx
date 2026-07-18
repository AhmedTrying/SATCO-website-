import type { Metadata } from "next";
import { sectors, sectorsIntro } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";

export const metadata: Metadata = {
  title: "Operating sectors",
  description: sectorsIntro.subhead,
};

/*
 * Sectors L1. Desktop: the design's horizontal cards with the docx L1 overview.
 * Small viewports: the docx "LM" condensed summaries (plan §8 — progressive
 * disclosure, same route) with a "View detailed capabilities →" link into L2.
 */
export default function SectorsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Operating sectors" }]}
        title={sectorsIntro.heading}
        headingId="sectors-l1-h"
        lead={sectorsIntro.subhead}
      />
      <Container className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)] pb-[var(--section-y)] pt-[clamp(2.5rem,5vw,4rem)]">
        {sectors.map((sector) => (
          <Reveal key={sector.slug}>
            <article className="flex flex-wrap items-center gap-[clamp(1.5rem,3vw,2.5rem)] overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative min-h-[240px] flex-[1_1_320px] self-stretch">
                <Picture
                  image={sector.card}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="absolute inset-0"
                  imgClassName="h-full w-full object-cover"
                  style={{ height: "100%", width: "100%" }}
                />
                <span className="absolute start-4 top-4 rounded-sm bg-bronze-950/70 px-3 py-1.5 font-display text-sm font-bold tracking-[0.1em] text-white">
                  {String(sector.order).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-[2_1_380px] p-[clamp(1.5rem,2.5vw,2.5rem)]">
                <h2 className="mb-3.5 mt-0 font-display text-[clamp(1.35rem,2.4vw,1.7rem)] font-bold leading-[1.2] text-strong">
                  {sector.name}
                </h2>
                {/* Desktop/tablet: L1 overview (docx "Operating Sectors Layer 1") */}
                <p className="mb-5 mt-0 hidden text-[15.5px] leading-[1.62] text-body md:block">
                  {sector.overviewShort}
                </p>
                {/* Phones: condensed docx "LM" summary */}
                <div className="md:hidden">
                  {sector.mobileSummary.split("\n\n").map((p) => (
                    <p key={p.slice(0, 24)} className="mb-3.5 mt-0 text-[15px] leading-[1.62] text-body">
                      {p}
                    </p>
                  ))}
                </div>
                <ArrowLink href={`/sectors/${sector.slug}`} className="hidden md:inline-flex">
                  View sector
                </ArrowLink>
                <ArrowLink href={`/sectors/${sector.slug}`} className="md:hidden">
                  {sector.mobileCta}
                </ArrowLink>
              </div>
            </article>
          </Reveal>
        ))}
      </Container>
    </>
  );
}
