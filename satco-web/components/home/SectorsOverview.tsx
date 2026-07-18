import { sectors, sectorsIntro } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";

/*
 * LOCKED (docx comments #6/#9): the hero and this Operating Sectors section
 * stay separate — never merge them.
 */
export function SectorsOverview() {
  return (
    <section aria-labelledby="sectors-h" className="bg-bg">
      <Container className="py-[var(--section-y)]">
        <div className="mb-[clamp(2.5rem,4vw,3.5rem)] max-w-[720px]">
          <Reveal>
            <h2
              id="sectors-h"
              className="mb-4 mt-0 font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.015em] text-strong"
            >
              {sectorsIntro.heading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="m-0 text-[clamp(1.05rem,1.6vw,1.2rem)] leading-[1.55] text-stone-600">
              {sectorsIntro.subhead}
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-6">
          {sectors.map((sector, i) => (
            <Reveal key={sector.slug} delay={(i % 2) * 80}>
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface">
                <div className="h-[190px] overflow-hidden">
                  <Picture
                    image={sector.card}
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    imgClassName="h-full w-full object-cover"
                    className="block h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col px-[26px] pb-7 pt-[26px]">
                  <h3 className="mb-3 mt-0 font-display text-[1.3rem] font-bold leading-[1.25] text-strong">
                    {sector.name}
                  </h3>
                  <p className="mb-5 mt-0 flex-1 text-[15px] leading-[1.62] text-body">
                    {sector.overviewShort}
                  </p>
                  <ArrowLink href={`/sectors/${sector.slug}`}>View sector</ArrowLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
