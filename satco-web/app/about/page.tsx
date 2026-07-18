import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About us",
  description:
    "SATCO is a Saudi-owned infrastructure and services group established in 1975 — company information, leadership, certifications, and clients.",
};

/* About L1 — intro (verbatim docx) + the four sub-page cards. */
const cards = [
  {
    href: "/about/company",
    title: "Company information",
    body: "An overview of SATCO’s history, evolution, and integrated operating model.",
  },
  {
    href: "/about/leadership",
    title: "Key people & leadership",
    body: "The leadership team guiding SATCO’s strategy, governance, and long-term direction.",
  },
  {
    href: "/about/certifications",
    title: "Classifications, licenses & certifications",
    body: "SATCO’s regulatory classifications and internationally recognized certifications.",
  },
  {
    href: "/about/clients",
    title: "Clients",
    body: "Organizations that have trusted SATCO across its operating sectors and delivery models.",
  },
];

const intro =
  "SATCO is a Saudi-owned infrastructure and services group operating across construction, airport infrastructure, operations as well as support services, and public–private partnerships. Established in 1975, SATCO supports complex projects that require scale, reliability, and long-term commitment.";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
        title="About us"
        headingId="about-h"
        lead={intro}
      />
      <Container className="py-[var(--section-y)]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[22px]">
          {cards.map((card, i) => (
            <Reveal key={card.href} delay={i * 70}>
              <Link
                href={card.href}
                className="flex h-full flex-col rounded-lg border border-border bg-surface px-7 py-[30px] no-underline transition-[border-color,box-shadow,transform] duration-[var(--dur-base)] hover:-translate-y-[3px] hover:border-bronze-300 hover:shadow-md"
              >
                <span aria-hidden="true" className="mb-4 font-display text-[13px] font-bold text-bronze-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mb-3 mt-0 font-display text-[1.25rem] font-bold leading-[1.25] text-strong">
                  {card.title}
                </h2>
                <p className="mb-5 mt-0 flex-1 text-[14.5px] leading-[1.6] text-body">
                  {card.body}
                </p>
                <span className="inline-flex items-center gap-[7px] text-[14.5px] font-semibold text-bronze-800">
                  Explore{" "}
                  <span aria-hidden="true" className="rtl:-scale-x-100">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
