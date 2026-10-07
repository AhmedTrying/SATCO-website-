import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";

export const metadata: Metadata = {
  title: "About us",
  description:
    "SATCO is a Saudi-owned infrastructure and services group established in 1975 — company information, leadership, certifications, and clients.",
};

/*
 * About L1 — intro (verbatim, FIX-20) + the four sub-page cards, upgraded to the
 * home card vocabulary (lift + border-warm + slow image zoom + accent draw).
 * Card imagery is decorative (empty alt — the card titles carry the meaning),
 * so the neutral-stock rule is satisfied without inventing captions.
 */
const cards = [
  {
    href: "/about/company",
    title: "Company information",
    body: "An overview of SATCO’s history, evolution, and integrated operating model.",
    image: "riyadh-2",
  },
  {
    href: "/about/leadership",
    title: "Key people & leadership",
    body: "The leadership team guiding SATCO’s strategy, governance, and long-term direction.",
    image: "team-2",
  },
  {
    href: "/about/certifications",
    title: "Classifications, licenses & certifications",
    body: "SATCO’s regulatory classifications and internationally recognized certifications.",
    image: "plant-1",
  },
  {
    href: "/about/clients",
    title: "Clients",
    body: "Organizations that have trusted SATCO across its operating sectors and delivery models.",
    image: "terminal-1",
  },
];

/* FIX-20: Tamer's About us landing text (email of 24 Sep 2026), verbatim. */
const intro = [
  "SATCO has built and operated infrastructure in Saudi Arabia since 1975. A private, Saudi-owned group, we work across four sectors — airport infrastructure and operations, construction, integrated operations and support services, and public–private partnerships — and where a client wants one partner for the life of an asset, we build it, then we operate it.",
  "Two projects show what that means. At King Khalid International Airport, SATCO designed, installed, and operated 43 passenger boarding bridges under a build-transfer-operate concession that ran from 2012 to 2026. At NEOM, SATCO built a village for 10,000 residents in under three years and then ran it — power, water, catering, medical, and maintenance — through 2025.",
  "The wider record: communities for more than 137,000 people built and supported, 4.8 million square meters built and maintained, more than 130 boarding bridges installed, and 1.3 million aircraft served at nine airports.",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About us"
        headingId="about-h"
        lead={intro}
      />
      <Container className="py-[var(--section-y)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 70} className="h-full">
              {/* Home hover choreography: v4's -translate-y-1 sets the native
                  `translate` property, so the transition list names it. */}
              <Link
                href={card.href}
                className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface no-underline transition-[translate,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-bronze-300 hover:shadow-md"
              >
                <div className="relative h-[180px] overflow-hidden">
                  <Picture
                    image={{ src: card.image, alt: "" }}
                    sizes="(min-width: 820px) 25vw, 100vw"
                    imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    className="block h-full"
                  />
                </div>
                <div className="flex flex-1 flex-col px-7 pb-[26px] pt-6">
                  <h2 className="mb-3 mt-0 font-display text-[1.25rem] font-bold leading-[1.25] text-strong">
                    {card.title}
                  </h2>
                  <p className="mb-5 mt-0 flex-1 text-[14.5px] leading-[1.6] text-body">
                    {card.body}
                  </p>
                  <span className="inline-flex items-center gap-[7px] text-[14.5px] font-semibold text-bronze-800 transition-[gap] duration-[var(--dur-base)] group-hover:gap-3">
                    Explore{" "}
                    <span aria-hidden="true" className="rtl:-scale-x-100">
                      →
                    </span>
                  </span>
                </div>
                {/* Bronze accent draws across the foot of the card on hover —
                    width grows from the inline-start edge in both directions */}
                <span
                  aria-hidden="true"
                  className="block h-[3px] w-0 bg-bronze-500 transition-[width] duration-[var(--dur-slow)] ease-[var(--ease-standard)] group-hover:w-full"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
