import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { BuildOperate } from "@/components/about/BuildOperate";

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
/* FIX-44 (Tamer): link labels are the content document's, not a generic "Explore". */
const cards = [
  {
    href: "/about/company",
    cta: "View Company Information",
    title: "Company information",
    body: "An overview of SATCO’s history, evolution, and integrated operating model.",
    image: "riyadh-2",
  },
  {
    href: "/about/leadership",
    cta: "Meet Our Leadership",
    title: "Key people & leadership",
    body: "The leadership team guiding SATCO’s strategy, governance, and long-term direction.",
    image: "team-2",
  },
  {
    href: "/about/certifications",
    cta: "View Licenses & Certifications",
    title: "Classifications, licenses & certifications",
    body: "SATCO’s regulatory classifications and internationally recognized certifications.",
    image: "plant-1",
  },
  {
    href: "/about/clients",
    cta: "View Clients",
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

/* Labels for the build/operate comparison — the two verbs of the intro. */
const buildOperate = {
  buildLabel: "Build",
  operateLabel: "Operate",
  controlLabel: "Compare a community under construction with the finished village",
};

/**
 * Wrap the parts of a verbatim string that match `pattern` in an accent span.
 * The words and their order never change — only their styling — so the copy
 * stays verbatim for readers and screen readers alike.
 */
function accent(text: string, pattern: RegExp, className: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > last) out.push(text.slice(last, start));
    out.push(
      <span key={start} className={className}>
        {match[0]}
      </span>,
    );
    last = start + match[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export default function AboutPage() {
  return (
    <>
      {/* Option C — "build, then operate". A dark cinematic band in C's
          charcoal (footer / contact band): the title and opening paragraph
          beside a draggable before/after of a community being built and the
          finished village running, then the two supporting paragraphs with
          the record's figures picked out in bronze. A keeps the plain
          PageHeader. */}
      <div className="on-dark relative isolate overflow-hidden bg-[#181512] text-stone-200">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_0%,rgb(209_138_32/0.16),transparent_70%)]"
        />
        <Container className="pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2.75rem,5.5vw,4.5rem)]">
          <div className="grid items-center gap-[clamp(2rem,4.5vw,4.5rem)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <h1
                id="about-h"
                className="m-0 font-display text-[clamp(2.75rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.03em] text-white"
              >
                About us
              </h1>
              <div aria-hidden="true" className="mb-6 mt-7 h-[3px] w-14 bg-bronze-400" />
              <p className="m-0 text-[clamp(1.08rem,1.45vw,1.25rem)] leading-[1.65] text-stone-200">
                {accent(
                  intro[0],
                  /we build it, then we operate it\./g,
                  "font-semibold text-bronze-200",
                )}
              </p>
            </div>
            <BuildOperate {...buildOperate} />
          </div>

          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(2rem,4.5vw,4.5rem)] gap-y-6 border-t border-white/12 pt-[clamp(1.75rem,3vw,2.5rem)] md:grid-cols-2">
            <p className="m-0 text-[clamp(0.98rem,1.2vw,1.06rem)] leading-[1.7] text-stone-300">
              {intro[1]}
            </p>
            <p className="m-0 text-[clamp(0.98rem,1.2vw,1.06rem)] leading-[1.7] text-stone-300">
              {accent(
                intro[2],
                /\d[\d,.]*(?: million)?/g,
                "font-display text-[1.2em] font-bold tracking-[-0.01em] text-bronze-200",
              )}
            </p>
          </div>
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
                    {card.cta}{" "}
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
