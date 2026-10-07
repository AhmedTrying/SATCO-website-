import { home } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Picture } from "@/components/ui/Picture";

export function WhoWeAre() {
  return (
    <section aria-labelledby="who-h" className="bg-sand">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(4rem,8vw,7rem)]">
        <Reveal>
          {/* FIX-07: no added headline; the "Who we are" label is the section
              heading, so the paragraph follows it directly. */}
          <h2
            id="who-h"
            className="mb-4 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700"
          >
            {home.whoWeAre.eyebrow}
          </h2>
          <p className="mb-7 mt-0 max-w-[62ch] text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.7] text-stone-700">
            {home.whoWeAre.body}
          </p>
          <ArrowLink href="/about">{home.whoWeAre.cta}</ArrowLink>
        </Reveal>
        <Reveal delay={120} className="relative">
          {/* Image drifts down-to-up behind its frame; the 1975 card drifts the
              opposite way (depth). The card's positioning classes stay on the
              outer div — Parallax owns only the inner transform, so Framer
              never fights the CSS translate. */}
          <div className="overflow-hidden rounded-lg">
            <Parallax strength={26} scale={1.1}>
              <Picture
                image={{
                  src: "construction-1",
                  alt: "Aerial view of a SATCO-built integrated residential community",
                }}
                sizes="(min-width: 1024px) 560px, 100vw"
                imgClassName="w-full object-cover"
                style={{ height: "clamp(280px,38vw,440px)" }}
              />
            </Parallax>
          </div>
          <div className="absolute bottom-0 start-0 translate-y-[28%] ltr:-translate-x-[8%] rtl:translate-x-[8%]">
            <Parallax strength={-12}>
              {/* FIX-06: small label above the big figure ("Established 1975"). */}
              <div className="rounded-md bg-bronze-800 px-6 py-[18px] text-white shadow-lg">
                <div className="mb-2 text-[12.5px] font-semibold uppercase leading-none tracking-[0.14em] text-bronze-200">
                  {home.whoWeAre.imageCard.label}
                </div>
                <div className="font-display text-[28px] font-bold leading-none tabular-nums">
                  {home.whoWeAre.imageCard.value}
                </div>
              </div>
            </Parallax>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
