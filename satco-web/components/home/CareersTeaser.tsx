import { home } from "@/content/home";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";

export function CareersTeaser() {
  return (
    <section
      aria-labelledby="careers-teaser-h"
      className="on-dark relative overflow-hidden bg-stone-950"
    >
      <Picture
        image={{
          src: "maintenance",
          alt: "",
        }}
        sizes="100vw"
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover object-[center_30%]"
        style={{ height: "100%", width: "100%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(29_26_22/0.9),rgb(53_30_3/0.62)_55%,rgb(53_30_3/0.35))] rtl:bg-[linear-gradient(270deg,rgb(29_26_22/0.9),rgb(53_30_3/0.62)_55%,rgb(53_30_3/0.35))]"
      />
      <Container className="relative z-[2] py-[clamp(4rem,8vw,7rem)]">
        <Reveal className="max-w-[620px]">
          <Eyebrow onDark className="mb-4">
            {home.careersTeaser.eyebrow}
          </Eyebrow>
          <h2
            id="careers-teaser-h"
            className="mb-5 mt-0 font-display text-[clamp(1.8rem,3.4vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.015em] text-white [text-wrap:balance]"
          >
            {home.careersTeaser.heading}
          </h2>
          <p className="mb-7 mt-0 text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.65] text-stone-50/90">
            {home.careersTeaser.body}
          </p>
          <ButtonLink href="/careers" variant="onImage">
            {home.careersTeaser.cta}
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
