import type { Metadata } from "next";
import Link from "next/link";
import { company } from "@/content/company";
import { sectors } from "@/content/sectors";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";

export const metadata: Metadata = {
  title: "Company information",
  description:
    "Established in 1975, SATCO has evolved from a traditional contractor into a fully integrated infrastructure and services platform.",
};

/*
 * Company Information — approved docx copy verbatim (LongForm), laid out as an
 * editorial sequence (UCC-reference upgrade): the paragraph run is broken into
 * two image-paired halves around a dark pull-fact band built from the existing
 * content facts. The design's representative copy, milestones timeline, and
 * operating-model blurb are still NOT reproduced: the timeline dates were
 * invented content (kickoff §8).
 */
export default function CompanyPage() {
  const storyA = company.paragraphs.slice(0, 2);
  const storyB = company.paragraphs.slice(2);
  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About us", href: "/about" },
          { label: "Company information" },
        ]}
        title="Company information"
        headingId="company-h"
      />

      {/* Story, part 1 — beside the client photo drifting in its frame */}
      <section className="bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <Eyebrow className="mb-4">{company.eyebrow}</Eyebrow>
            <h2 className="mb-5 mt-0 max-w-[22ch] font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.14] tracking-[-0.015em] text-strong [text-wrap:balance]">
              {company.heading}
            </h2>
            {storyA.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mb-[18px] mt-0 max-w-[66ch] text-base leading-[1.72] text-stone-700 last:mb-0"
              >
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-lg">
              <Parallax strength={26} scale={1.1}>
                <Picture
                  image={company.image}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  imgClassName="w-full object-cover"
                  style={{ height: "clamp(280px,36vw,440px)" }}
                />
              </Parallax>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Pull-fact band — the two content facts over a dimmed city aerial.
          Neutral stock as decorative background (empty alt), CareersTeaser
          pattern: slow parallax drift + gradient-free flat scrim. */}
      <section className="on-dark relative overflow-hidden bg-stone-950">
        <Parallax strength={34} scale={1.14} className="absolute inset-0">
          <Picture
            image={{ src: "riyadh-1", alt: "" }}
            sizes="100vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            style={{ height: "100%", width: "100%" }}
          />
        </Parallax>
        <div aria-hidden="true" className="absolute inset-0 bg-stone-950/80" />
        <Container className="relative z-[2] flex flex-wrap items-center gap-x-[clamp(3.5rem,9vw,8rem)] gap-y-9 py-[clamp(3rem,6vw,5rem)]">
          {company.facts.map((fact, i) => (
            <Reveal key={fact.label} delay={i * 90}>
              <div className="border-s-2 border-bronze-500 ps-6">
                <div className="font-display text-[clamp(2.3rem,4.5vw,3.2rem)] font-bold leading-none text-white tabular-nums">
                  {fact.value}
                </div>
                <div className="mt-2 text-[13.5px] tracking-[0.05em] text-bronze-200">
                  {fact.label}
                </div>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Story, part 2 — image leads (neutral stock, neutral alt) */}
      <section className="bg-sand">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2.5rem,5vw,4.5rem)] py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <div className="overflow-hidden rounded-lg">
              <Parallax strength={26} scale={1.1}>
                <Picture
                  image={{ src: "team-2", alt: "Team in hard hats talking on site" }}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  imgClassName="w-full object-cover"
                  style={{ height: "clamp(260px,34vw,420px)" }}
                />
              </Parallax>
            </div>
          </Reveal>
          <Reveal delay={120}>
            {storyB.map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mb-[18px] mt-0 max-w-[66ch] text-base leading-[1.72] text-stone-700 last:mb-0"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Four connected sectors — link cards in the home hover vocabulary */}
      <section aria-labelledby="model-h" className="border-t border-border bg-surface">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <h2
              id="model-h"
              className="mb-[30px] mt-0 font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong"
            >
              {company.sectorsLinkHeading}
            </h2>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[18px]">
            {sectors.map((sector, i) => (
              <Reveal key={sector.slug} delay={i * 70} className="h-full">
                <Link
                  href={`/sectors/${sector.slug}`}
                  className="group flex h-full flex-col gap-10 rounded-lg border border-border bg-surface p-[26px] no-underline transition-[translate,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-bronze-300 hover:shadow-md"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-[13px] font-bold text-bronze-500"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-auto flex items-end justify-between gap-4">
                    <span className="font-display text-[1.1rem] font-bold leading-[1.3] text-strong">
                      {sector.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[1.05rem] font-semibold text-bronze-800 transition-transform duration-[var(--dur-base)] group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
