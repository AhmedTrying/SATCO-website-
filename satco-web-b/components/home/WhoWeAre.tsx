import { home } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";

/*
 * Option B — "Panorama" (2026-10-04, see docs/VARIANTS.md). A wide, high-
 * resolution photo band (a SATCO boarding bridge at dusk), a white text card
 * overlapping its lower edge, and the founding year ("Established 1975") set
 * large beside the card. All copy is the
 * shared, verbatim content; FIX-07 holds: "Who we are" is the heading, no
 * added headline.
 */
export function WhoWeAre() {
  return (
    <section aria-labelledby="who-h" className="bg-sand">
      <Container className="py-[var(--home-section-y)]">
        {/* Panorama band — the image drifts behind its frame (depth). */}
        <Reveal>
          <div className="overflow-hidden rounded-lg">
            <Parallax strength={30} scale={1.12}>
              <Picture
                image={{
                  src: "who-panorama",
                  alt: "A SATCO passenger boarding bridge at an airport terminal at dusk",
                }}
                // Band width × 1.12 parallax scale, so dense screens fetch 2200/2800.
                sizes="(min-width: 1440px) 1530px, 112vw"
                imgClassName="w-full object-cover"
                style={{ height: "clamp(260px,40vw,520px)", objectPosition: "center 45%" }}
              />
            </Parallax>
          </div>
        </Reveal>

        {/* Card + year: the card climbs over the band's lower edge; the year
            sits on the sand to its side (below it on small screens). On lg the
            year is pushed down by the card's overlap plus a gap, so it always
            starts below the photo however short the card gets on wide screens
            (aligning it to the card's bottom let it ride up onto the image). */}
        <div className="relative z-[2] -mt-[clamp(3rem,9vw,8rem)] grid items-start gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-10 px-[clamp(0.75rem,3vw,2.5rem)] lg:grid-cols-12">
          <Reveal delay={90} className="lg:col-span-7">
            <div className="rounded-lg border-t-[3px] border-bronze-700 bg-surface p-[clamp(1.6rem,3.6vw,3rem)] shadow-lg">
              <h2
                id="who-h"
                className="mb-4 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700"
              >
                {home.whoWeAre.eyebrow}
              </h2>
              <p className="mb-7 mt-0 text-[clamp(1.05rem,1.45vw,1.2rem)] leading-[1.7] text-stone-800">
                {home.whoWeAre.body}
              </p>
              <ArrowLink href="/about">{home.whoWeAre.cta}</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={180} className="lg:col-span-5 lg:mt-[calc(clamp(3rem,9vw,8rem)+1.75rem)]">
            <div className="border-s-[3px] border-bronze-700 ps-[clamp(1.1rem,2.4vw,1.75rem)]">
              <div className="mb-3 font-display text-[12.5px] font-semibold uppercase leading-none tracking-[0.16em] text-bronze-700">
                {home.whoWeAre.imageCard.label}
              </div>
              <div className="font-display text-[clamp(4.25rem,9vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.03em] text-bronze-800 tabular-nums">
                {home.whoWeAre.imageCard.value}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
