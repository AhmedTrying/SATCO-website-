import { home } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";

export function WhoWeAre() {
  return (
    <section aria-labelledby="who-h" className="bg-sand">
      <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(4rem,8vw,7rem)]">
        <Reveal>
          <Eyebrow className="mb-4">{home.whoWeAre.eyebrow}</Eyebrow>
          <h2
            id="who-h"
            className="mb-6 mt-0 max-w-[16ch] font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.015em] text-strong [text-wrap:balance]"
          >
            {home.whoWeAre.heading}
          </h2>
          <p className="mb-7 mt-0 max-w-[62ch] text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.7] text-stone-700">
            {home.whoWeAre.body}
          </p>
          <ArrowLink href="/about">{home.whoWeAre.cta}</ArrowLink>
        </Reveal>
        <Reveal delay={120} className="relative">
          <Picture
            image={{
              src: "construction-1",
              alt: "Aerial view of a SATCO-built integrated residential community",
            }}
            sizes="(min-width: 1024px) 560px, 100vw"
            imgClassName="w-full rounded-lg object-cover"
            style={{ height: "clamp(280px,38vw,440px)" }}
          />
          <div className="absolute bottom-0 start-0 translate-y-[28%] rounded-md bg-bronze-800 px-6 py-[18px] text-white shadow-lg ltr:-translate-x-[8%] rtl:translate-x-[8%]">
            <div className="font-display text-[28px] font-bold leading-none tabular-nums">
              {home.whoWeAre.imageCard.value}
            </div>
            <div className="mt-1.5 text-[12.5px] tracking-[0.04em] text-bronze-200">
              {home.whoWeAre.imageCard.label}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
