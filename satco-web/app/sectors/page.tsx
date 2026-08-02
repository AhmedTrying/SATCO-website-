import type { Metadata } from "next";
import { sectors, sectorsIntro } from "@/content/sectors";
import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";

export const metadata: Metadata = {
  title: "Operating sectors",
  description: sectorsIntro.subhead,
};

/*
 * Sectors L1. Desktop: the design's horizontal cards with the docx L1 overview,
 * upgraded to the home vocabulary — alternating image sides, parallax depth on
 * imagery, and the card hover choreography (lift + border-warm + slow zoom).
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
        {sectors.map((sector, i) => (
          <Reveal key={sector.slug}>
            {/* Alternating rows (UCC-reference rhythm): flex-row-reverse is
                direction-relative, so the RTL seam is untouched; single-column
                wrap order (image, then text) is unchanged on phones. */}
            <article
              className={cn(
                "group flex flex-wrap items-center gap-[clamp(1.5rem,3vw,2.5rem)] overflow-hidden rounded-lg border border-border bg-surface transition-[translate,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-bronze-300 hover:shadow-md",
                i % 2 === 1 && "md:flex-row-reverse",
              )}
            >
              <div className="relative min-h-[260px] flex-[1_1_320px] self-stretch overflow-hidden">
                {/* Image drifts slower than the scroll (scale hides the edges);
                    the hover zoom rides on the img so Framer never fights it. */}
                <Parallax strength={14} scale={1.12} className="absolute inset-0">
                  <Picture
                    image={sector.card}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="absolute inset-0"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                    style={{ height: "100%", width: "100%" }}
                  />
                </Parallax>
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
