import { sectors, sectorsIntro } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";
import { cn } from "@/lib/utils";

/*
 * LOCKED (docx comments #6/#9): the hero and this Operating Sectors section
 * stay separate — never merge them.
 *
 * 2A band design: dark section; flat columns divided by dotted rules
 * (verticals on the 4-up row, horizontals when the grid stacks).
 * Copy, sector order, images, and links are unchanged content.
 *
 * Client feedback (Sep 2026): no "What we do" kicker (FIX-08); the subhead
 * sits directly beneath the heading, larger (Bandar, FIX-09/OPT-07); no
 * 01–04 card numbers (FIX-10).
 */
export function SectorsOverview() {
  return (
    <section aria-labelledby="sectors-h" className="on-dark bg-stone-950">
      <Container className="py-[var(--section-y)]">
        <div className="mb-[clamp(2.5rem,4vw,3.5rem)]">
          <Reveal>
            <h2
              id="sectors-h"
              className="my-0 font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.015em] text-white"
            >
              {sectorsIntro.heading}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mb-0 mt-4 max-w-[52ch] text-[clamp(1.1rem,1.7vw,1.3rem)] leading-[1.55] text-stone-300">
              {sectorsIntro.subhead}
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((sector, i) => (
            <Reveal
              key={sector.slug}
              delay={(i % 4) * 80}
              className={cn(
                "h-full border-dotted border-stone-700",
                // stacked: dotted rule above every card but the first…
                "border-t first:border-t-0",
                // …2-up: none above the first row, verticals between the pairs…
                "sm:[&:nth-child(-n+2)]:border-t-0 sm:even:border-s",
                // …4-up: verticals only
                "lg:border-t-0 lg:border-s lg:first:border-s-0",
              )}
            >
              <article className="group flex h-full flex-col pt-7 transition-colors duration-[var(--dur-slow)] hover:bg-white/[0.03] lg:pt-0">
                <div className="overflow-hidden">
                  <Picture
                    image={sector.card}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    imgClassName="h-[clamp(150px,13vw,190px)] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    className="block"
                  />
                </div>
                <div className="flex flex-1 flex-col px-[22px] pb-9 pt-6">
                  <h3 className="mb-3 mt-0 font-display text-[1.3rem] font-bold leading-[1.25] text-white">
                    {sector.name}
                  </h3>
                  <p className="mb-6 mt-0 flex-1 text-[15px] leading-[1.62] text-stone-400">
                    {sector.overviewShort}
                  </p>
                  <ArrowLink tone="dark" href={`/sectors/${sector.slug}`}>
                    View sector
                  </ArrowLink>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
