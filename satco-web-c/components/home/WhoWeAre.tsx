import { home } from "@/content/home";
import { sectors } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Emblem } from "@/components/ui/Emblem";
import { Picture } from "@/components/ui/Picture";

/*
 * Option C — "Mosaic and seal" (2026-10-04, see docs/VARIANTS.md). Text on the
 * start side; on the other, a staggered 2×2 mosaic with one photo per
 * operating sector (each sector's lead gallery image, captioned with its short
 * name) and, at its centre, a round seal: the SATCO sun with the shared
 * "Established · 1975" badge copy circling it, slowly turning (the global
 * reduced-motion clamp stills it). The ring is decorative; an sr-only line
 * carries "Established 1975". FIX-07 holds: "Who we are" is the heading.
 */
export function WhoWeAre() {
  const { label, value } = home.whoWeAre.imageCard;
  const ring = `${label} · ${value} · ${label} · ${value} · `.toUpperCase();
  const tiles = sectors.map((s) => ({
    slug: s.slug,
    name: s.shortName,
    image: s.gallery?.[0] ?? s.card,
  }));

  return (
    <section aria-labelledby="who-h" className="overflow-hidden bg-sand">
      <Container className="grid items-center gap-[clamp(2.5rem,6vw,5.5rem)] py-[var(--home-section-y)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <Reveal>
          <h2
            id="who-h"
            className="mb-5 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700"
          >
            {home.whoWeAre.eyebrow}
          </h2>
          <span aria-hidden="true" className="mb-6 block h-[3px] w-12 rounded-full bg-bronze-700" />
          <p className="mb-8 mt-0 max-w-[52ch] text-[clamp(1.05rem,1.45vw,1.2rem)] leading-[1.7] text-stone-800">
            {home.whoWeAre.body}
          </p>
          <p className="sr-only">
            {label} {value}
          </p>
          <ArrowLink href="/about">{home.whoWeAre.cta}</ArrowLink>
        </Reveal>

        <div className="relative">
          <ul className="m-0 grid list-none grid-cols-2 gap-[clamp(0.6rem,1.4vw,1rem)] p-0 pb-[clamp(1.5rem,3vw,2.5rem)]">
            {tiles.map((tile, i) => (
              <li
                key={tile.slug}
                // Staggered columns: the end column sits lower (rhythm).
                className={i % 2 === 1 ? "translate-y-[clamp(1.5rem,3vw,2.5rem)]" : undefined}
              >
                <Reveal delay={i * 90}>
                  <figure className="group relative m-0 overflow-hidden rounded-lg">
                    <Picture
                      image={tile.image}
                      sizes="(min-width: 1024px) 340px, 50vw"
                      className="block"
                      imgClassName="aspect-[4/3] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(0deg,rgb(24_21_18/0.72),rgb(24_21_18/0)_55%)]"
                    />
                    {/* End-column captions sit at the outer corner, clear of the seal. */}
                    <figcaption
                      className={`absolute bottom-0 ${i % 2 === 1 ? "end-0 text-end" : "start-0"} px-[clamp(0.75rem,1.6vw,1.1rem)] pb-[clamp(0.6rem,1.3vw,0.9rem)] font-display text-[clamp(0.8rem,1.1vw,0.95rem)] font-semibold leading-tight text-white`}
                    >
                      {tile.name}
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>

          {/* The seal, centred on the mosaic's crossing. */}
          <div
            aria-hidden="true"
            // top-1/2 is the crossing: the end column's drop equals the list's
            // bottom padding, so the two offsets cancel out.
            className="pointer-events-none absolute start-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2"
          >
            <Reveal delay={300} fadeOnly>
              <div className="relative grid h-[clamp(108px,12vw,148px)] w-[clamp(108px,12vw,148px)] place-items-center rounded-full border border-bronze-200 bg-surface shadow-lg">
                <svg viewBox="0 0 100 100" className="who-seal-ring absolute inset-[6%] h-[88%] w-[88%]">
                  <defs>
                    <path id="who-seal-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  {/* textLength stretches the ring text to exactly one lap
                      (2π × 38 ≈ 239) so it meets itself with no gap. */}
                  <text
                    className="fill-bronze-800 font-display text-[7.6px] font-semibold"
                    textLength={238}
                    lengthAdjust="spacing"
                  >
                    <textPath href="#who-seal-path">
                      {ring}
                    </textPath>
                  </text>
                </svg>
                <Emblem size={44} />
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
