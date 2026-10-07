import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
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

/*
 * The third paragraph typeset as a ledger: the same words in the same order,
 * only broken into four cells with each figure set large. The check below
 * fails the build if the pieces ever stop adding up to the verbatim sentence.
 */
const recordLead = "The wider record: ";
const recordItems: [before: string, figure: string, after: string][] = [
  ["communities for more than ", "137,000", " people built and supported, "],
  ["", "4.8 million", " square meters built and maintained, "],
  ["more than ", "130", " boarding bridges installed, and "],
  ["", "1.3 million", " aircraft served at nine airports."],
];
if (recordLead + recordItems.map((item) => item.join("")).join("") !== intro[2]) {
  throw new Error("About us: the record ledger no longer matches the verbatim intro (FIX-20)");
}

const promise = "we build it, then we operate it.";
if (!intro[0].endsWith(promise)) {
  throw new Error("About us: the highlighted clause no longer ends the verbatim intro (FIX-20)");
}

export default function AboutPage() {
  const [beforePromise] = intro[0].split(promise);
  return (
    <>
      {/* Option B — "the record". A deep bronze-brown band (the sector pages'
          brown, as on B's home Operating sectors band) with a giant outlined
          1975 behind the copy. The opening paragraph is the statement, its
          last clause picked out in bronze; the NEOM / King Khalid paragraph
          sits beside it; the "wider record" sentence runs across the foot as
          a four-figure ledger. A keeps the plain PageHeader. */}
      <div className="on-dark relative isolate overflow-hidden bg-bronze-950 text-stone-200">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_15%_0%,rgb(209_138_32/0.22),transparent_70%)] rtl:bg-[radial-gradient(60%_70%_at_85%_0%,rgb(209_138_32/0.22),transparent_70%)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -end-[0.06em] -top-[0.18em] -z-10 select-none font-display text-[clamp(9rem,26vw,24rem)] font-bold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_rgb(232_190_120/0.16)]"
        >
          1975
        </span>
        <Container className="pb-[clamp(2.75rem,5vw,4rem)] pt-[clamp(2.75rem,5.5vw,4.5rem)]">
          <h1
            id="about-h"
            className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.22em] text-bronze-300"
          >
            About us
          </h1>
          <div className="mt-6 grid items-end gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
            <p className="m-0 max-w-[46ch] font-display text-[clamp(1.35rem,2.15vw,1.9rem)] font-medium leading-[1.38] tracking-[-0.012em] text-white">
              {beforePromise}
              <span className="text-bronze-300">{promise}</span>
            </p>
            <p className="m-0 border-s-2 border-bronze-400/60 ps-5 text-[clamp(0.98rem,1.2vw,1.05rem)] leading-[1.7] text-stone-300">
              {intro[1]}
            </p>
          </div>

          <p className="mb-0 mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-8 gap-y-7 border-t border-white/15 pt-[clamp(1.75rem,3vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-4">
            <span className="block font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-bronze-300 sm:col-span-2 lg:col-span-4">
              {recordLead}
            </span>
            {recordItems.map(([before, figure, after]) => (
              <span key={figure} className="block border-s border-white/15 ps-5">
                <span className="block min-h-[1.5em] text-[14px] leading-[1.5] text-stone-400">
                  {before}
                </span>
                <span className="block font-display text-[clamp(2.4rem,4.2vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white tabular-nums">
                  {figure}
                </span>
                <span className="mt-2 block text-[14px] leading-[1.5] text-stone-300">{after}</span>
              </span>
            ))}
          </p>
        </Container>
      </div>
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
