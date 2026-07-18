import Link from "next/link";
import {
  pendingExperienceCard,
  sectors,
  showPendingExperience,
} from "@/content/sectors";
import type { Sector } from "@/lib/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";
import { Pill } from "@/components/ui/Pill";
import { CapabilityAccordion } from "./CapabilityAccordion";

function paragraphs(text: string) {
  return text.split("\n\n");
}

/** Full L2 sector template per the approved design; all body copy verbatim docx. */
export function SectorL2({ sector }: { sector: Sector }) {
  const number = String(sector.order).padStart(2, "0");
  const total = String(sectors.length).padStart(2, "0");
  const experiencePublished =
    sector.experience.status === "confirmed" || showPendingExperience;

  return (
    <>
      {/* Hero */}
      <div className="on-dark relative overflow-hidden bg-stone-950">
        <Picture
          image={sector.hero}
          sizes="100vw"
          priority
          className="absolute inset-0"
          imgClassName="h-full w-full object-cover"
          style={{ height: "100%", width: "100%", objectPosition: sector.heroPosition }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(53_30_3/0.9),rgb(53_30_3/0.6)_55%,rgb(35_31_26/0.28))] rtl:bg-[linear-gradient(270deg,rgb(53_30_3/0.9),rgb(53_30_3/0.6)_55%,rgb(35_31_26/0.28))]"
        />
        <Container className="relative z-[2] pb-[clamp(3rem,6vw,5rem)] pt-[clamp(2.5rem,5vw,4rem)]">
          <Breadcrumbs
            onDark
            className="mb-[22px]"
            items={[
              { label: "Home", href: "/" },
              { label: "Operating sectors", href: "/sectors" },
              { label: sector.shortName },
            ]}
          />
          <p className="mb-3.5 mt-0 font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-bronze-200">
            Operating sector {number} / {total}
          </p>
          <h1
            id={`${sector.slug}-h`}
            className="mb-4 mt-0 max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.015em] text-white [text-wrap:balance]"
          >
            {sector.name}
          </h1>
          <p className="m-0 max-w-[52ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.5] text-stone-50/90">
            {sector.tagline}
          </p>
        </Container>
      </div>

      {/* Overview */}
      <section aria-labelledby={`${sector.slug}-ov-h`} className="border-b border-border bg-surface">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <Eyebrow className="mb-4">
              <span id={`${sector.slug}-ov-h`}>Overview</span>
            </Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            {paragraphs(sector.overview).map((p) => (
              <p
                key={p.slice(0, 24)}
                className="mb-4 mt-0 max-w-[68ch] text-[clamp(1.1rem,1.7vw,1.35rem)] leading-[1.6] text-stone-700 last:mb-0"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Core capabilities */}
      <section aria-labelledby={`${sector.slug}-cap-h`} className="bg-bg">
        <Container className="py-[var(--section-y)]">
          <div className="mb-[clamp(2rem,3.5vw,3rem)] max-w-[640px]">
            <Reveal>
              <Eyebrow className="mb-3">Capabilities</Eyebrow>
            </Reveal>
            <Reveal delay={70}>
              <h2
                id={`${sector.slug}-cap-h`}
                className="m-0 font-display text-[clamp(1.7rem,3.2vw,2.3rem)] font-bold leading-[1.14] tracking-[-0.015em] text-strong"
              >
                Core capabilities
              </h2>
            </Reveal>
          </div>
          {sector.capabilitiesProse ? (
            <Reveal>
              <p className="m-0 max-w-[68ch] text-[clamp(1.05rem,1.5vw,1.2rem)] leading-[1.68] text-stone-700">
                {sector.capabilitiesProse}
              </p>
            </Reveal>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
              {sector.capabilities.map((cap, i) => (
                <Reveal key={cap.id} delay={(i % 2) * 70}>
                  <CapabilityAccordion index={i + 1} title={cap.title} body={cap.body} />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Delivery models */}
      <section
        aria-labelledby={`${sector.slug}-dm-h`}
        className="border-y border-border bg-sand"
      >
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(1.5rem,4vw,3.5rem)]">
            <Reveal>
              <Eyebrow className="mb-3">Delivery models</Eyebrow>
              <h2
                id={`${sector.slug}-dm-h`}
                className="m-0 font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong"
              >
                {sector.delivery.heading}
              </h2>
            </Reveal>
            <Reveal delay={90}>
              {paragraphs(sector.delivery.description).map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="mb-6 mt-0 max-w-[60ch] text-base leading-[1.68] text-stone-700"
                >
                  {p}
                </p>
              ))}
              <div className="flex flex-wrap gap-2.5">
                {sector.delivery.models.map((model) => (
                  <Pill key={model}>{model}</Pill>
                ))}
              </div>
              {sector.delivery.secondary ? (
                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="mb-2 mt-0 font-display text-[1.05rem] font-bold text-strong">
                    {sector.delivery.secondary.title}
                  </h3>
                  <p className="m-0 max-w-[60ch] text-[15px] leading-[1.66] text-stone-700">
                    {sector.delivery.secondary.body}
                  </p>
                </div>
              ) : null}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Selected experience */}
      <section aria-labelledby={`${sector.slug}-exp-h`} className="bg-surface">
        <Container className="py-[var(--section-y)]">
          {experiencePublished ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(2rem,4vw,3.5rem)]">
              <Reveal>
                <Eyebrow className="mb-4">
                  <span id={`${sector.slug}-exp-h`}>Selected experience</span>
                </Eyebrow>
                {sector.experienceHeading ? (
                  <h2 className="mb-[22px] mt-0 font-display text-[clamp(1.6rem,3vw,2.1rem)] font-bold leading-[1.15] tracking-[-0.015em] text-strong">
                    {sector.experienceHeading}
                  </h2>
                ) : null}
                {paragraphs(sector.experience.body).map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mb-4 mt-0 max-w-[64ch] text-base leading-[1.7] text-stone-700"
                  >
                    {p}
                  </p>
                ))}
                {sector.experience.projectsLink ? (
                  <p className="mb-0 mt-6">
                    {/* Future /projects page — link reserved, rendered disabled (plan §2) */}
                    <span
                      aria-disabled="true"
                      title="Projects page coming soon"
                      className="inline-flex cursor-not-allowed items-center gap-[7px] text-[15px] font-semibold text-stone-400"
                    >
                      {sector.experience.projectsLink.label}{" "}
                      <span aria-hidden="true" className="rtl:-scale-x-100">
                        →
                      </span>
                    </span>
                    <span className="ms-2 text-[12.5px] text-stone-600">
                      Projects page coming soon
                    </span>
                  </p>
                ) : null}
              </Reveal>
              {sector.slug === "airports" && sector.gallery?.[0] ? (
                <Reveal delay={100} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-bronze-800 p-6 text-white">
                      <div className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tabular-nums">
                        130+
                      </div>
                      <div className="mt-2 text-[13px] leading-[1.4] text-bronze-200">
                        Passenger boarding bridges installed
                      </div>
                    </div>
                    <div className="rounded-lg bg-stone-900 p-6 text-white">
                      <div className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-bold leading-none tabular-nums">
                        9
                      </div>
                      <div className="mt-2 text-[13px] leading-[1.4] text-stone-400">
                        Airports supported
                      </div>
                    </div>
                  </div>
                  <Picture
                    image={sector.gallery[0]}
                    sizes="(min-width: 1024px) 520px, 100vw"
                    imgClassName="h-[220px] w-full rounded-lg object-cover"
                  />
                </Reveal>
              ) : null}
            </div>
          ) : (
            <>
              <Reveal>
                <Eyebrow className="mb-[18px]">
                  <span id={`${sector.slug}-exp-h`}>Selected experience</span>
                </Eyebrow>
              </Reveal>
              <Reveal>
                {/* Strategic decision pending (plan §12 Q4) — draft copy stays unpublished */}
                <div className="flex max-w-[760px] items-start gap-4 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-[clamp(1.5rem,3vw,2.25rem)]">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-2.5 w-2.5 flex-none rounded-[50%] bg-bronze-500"
                  />
                  <div>
                    <h2 className="mb-2 mt-0 font-display text-[1.2rem] font-bold text-strong">
                      {pendingExperienceCard.heading}
                    </h2>
                    <p className="m-0 text-[15px] leading-[1.65] text-body">
                      {pendingExperienceCard.body}{" "}
                      <Link href="/contact" className="font-semibold text-bronze-800 no-underline hover:underline">
                        {pendingExperienceCard.linkLabel}
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </Reveal>
            </>
          )}
        </Container>
      </section>

      {/* Why SATCO */}
      <section
        aria-labelledby={`${sector.slug}-why-h`}
        className="border-t border-bronze-100 bg-bronze-50"
      >
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <div className="max-w-[820px] border-s-[3px] border-bronze-800 ps-[clamp(1.25rem,3vw,2rem)]">
              <Eyebrow className="mb-4">
                <span id={`${sector.slug}-why-h`}>Why SATCO in {sector.whyLabel}</span>
              </Eyebrow>
              <p className="m-0 text-[clamp(1.15rem,1.9vw,1.4rem)] leading-[1.55] text-stone-800">
                {sector.whySatco}
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-9">
              <ButtonLink href="/contact">{sector.contactCta}</ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
