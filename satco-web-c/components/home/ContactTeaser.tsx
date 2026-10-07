import { home } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SkylineContinuation } from "./SkylineContinuation";

/*
 * OPT-04 (Option C): the footer's charcoal, so the contact band and the footer
 * read as one closing block, divided by a thin bronze line. On large screens
 * the footer's faint Riyadh skyline continues up into the band (see
 * SkylineContinuation); the scrim matches the footer's.
 */
export function ContactTeaser() {
  return (
    <section
      aria-labelledby="contact-teaser-h"
      className="on-dark relative isolate overflow-hidden bg-[#181512]"
    >
      <SkylineContinuation />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#181512]/65" />

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

      {/* Thin bronze divider between the band and the footer, container width */}
      <div aria-hidden="true" className="mx-auto max-w-[var(--container-max)] px-[var(--container-x)]">
        <div className="h-px bg-bronze-600/80" />
      </div>
    </section>
  );
}
