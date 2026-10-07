import { home } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

/*
 * OPT-04 (Option B): a solid deep bronze-brown band that bridges the warm
 * Careers photo above and the dark footer below, with a white heading and the
 * light button the Careers teaser uses.
 */
export function ContactTeaser() {
  return (
    <section aria-labelledby="contact-teaser-h" className="on-dark bg-bronze-900">
      <div className="mx-auto max-w-[820px] px-[var(--container-x)] py-[var(--home-section-y)] text-center">
        <Reveal>
          <h2
            id="contact-teaser-h"
            className="mb-4 mt-0 font-display text-[clamp(1.7rem,3vw,2.3rem)] font-bold leading-[1.16] tracking-[-0.015em] text-white [text-wrap:balance]"
          >
            {home.contactTeaser.heading}
          </h2>
          <ButtonLink href="/contact" variant="onImage" className="mt-3">
            {home.contactTeaser.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
