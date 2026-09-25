import { home } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function ContactTeaser() {
  return (
    <section aria-labelledby="contact-teaser-h" className="border-t border-border bg-sand">
      <div className="mx-auto max-w-[820px] px-[var(--container-x)] py-[clamp(4rem,7vw,6rem)] text-center">
        <Reveal>
          <h2
            id="contact-teaser-h"
            className="mb-4 mt-0 font-display text-[clamp(1.7rem,3vw,2.3rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong [text-wrap:balance]"
          >
            {home.contactTeaser.heading}
          </h2>
          <ButtonLink href="/contact" className="mt-3">
            {home.contactTeaser.cta}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
