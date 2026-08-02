import Link from "next/link";
import {
  pendingExperienceCard,
  sectors,
  showPendingExperience,
} from "@/content/sectors";
import type { Sector } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Parallax } from "@/components/motion/Parallax";
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
  const gallery = sector.gallery ?? [];
  /* 3+ images → large tile + stacked pair; 2 images → weighted pair */
  const mosaic = gallery.length >= 3;

  return (
    <>
      {/* Hero — parallax depth on the imagery, staggered text reveal, and a
          decorative oversized sector numeral (aria-hidden; the visible
          "Operating sector NN / NN" line carries the meaning). */}
      <div className="on-dark relative overflow-hidden bg-stone-950">
        <Parallax strength={26} scale={1.15} className="absolute inset-0">
          <Picture
            image={sector.hero}
            sizes="100vw"
            priority
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            style={{ height: "100%", width: "100%", objectPosition: sector.heroPosition }}
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(53_30_3/0.9),rgb(53_30_3/0.6)_55%,rgb(35_31_26/0.28))] rtl:bg-[linear-gradient(270deg,rgb(53_30_3/0.9),rgb(53_30_3/0.6)_55%,rgb(35_31_26/0.28))]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-0.1em] end-[2%] z-[1] hidden select-none font-display text-[clamp(7rem,17vw,13rem)] font-bold leading-none text-white/[0.07] md:block"
        >
          {number}
        </div>
        <Container className="relative z-[2] pb-[clamp(3.5rem,7vw,6rem)] pt-[clamp(2.75rem,5.5vw,4.5rem)]">
          <Breadcrumbs
            onDark
            className="mb-[22px]"
            items={[
              { label: "Home", href: "/" },
              { label: "Operating sectors", href: "/sectors" },
              { label: sector.shortName },
            ]}
          />
          <Reveal>
            <p className="mb-3.5 mt-0 font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-bronze-200">
              Operating sector {number} / {total}
            </p>
          </Reveal>
          <Reveal delay={70}>
            <h1
              id={`${sector.slug}-h`}
              className="mb-4 mt-0 max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.1rem)] font-bold leading-[1.08] tracking-[-0.015em] text-white [text-wrap:balance]"
            >
              {sector.name}
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="m-0 max-w-[52ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-[1.5] text-stone-50/90">
              {sector.tagline}
            </p>
          </Reveal>
        </Container>
      </div>

      {/* Overview — editorial two-column rhythm: label rail + prose, with the
          opening paragraph set larger (pure styling; copy untouched). */}
      <section aria-labelledby={`${sector.slug}-ov-h`} className="border-b border-border bg-surface">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <div className="grid items-start gap-[clamp(1.5rem,4vw,3.5rem)] md:grid-cols-[200px_1fr]">
            <Reveal>
              <Eyebrow>
                <span id={`${sector.slug}-ov-h`}>Overview</span>
              </Eyebrow>
              <span aria-hidden="true" className="mt-5 block h-[3px] w-12 rounded-full bg-bronze-700" />
            </Reveal>
            <div className="flex flex-col gap-5">
              {paragraphs(sector.overview).map((p, i) => (
                <Reveal key={p.slice(0, 24)} delay={80 + i * 80}>
                  <p
                    className={cn(
                      "m-0 max-w-[68ch]",
                      i === 0
                        ? "text-[clamp(1.2rem,1.9vw,1.5rem)] leading-[1.55] text-stone-800"
                        : "text-[clamp(1.02rem,1.5vw,1.2rem)] leading-[1.7] text-stone-700",
                    )}
                  >
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
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
              <div className="max-w-[880px] border-s-[3px] border-bronze-800 ps-[clamp(1.25rem,3vw,2rem)]">
                <p className="m-0 text-[clamp(1.1rem,1.7vw,1.35rem)] leading-[1.6] text-stone-800">
                  {sector.capabilitiesProse}
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
              {sector.capabilities.map((cap, i) => (
                <Reveal key={cap.id} delay={(i % 2) * 70} className="h-full">
                  <CapabilityAccordion index={i + 1} title={cap.title} body={cap.body} />
                </Reveal>
              ))}
            </div>
          )}

          {/* Sector gallery — designed image band (imagery from content; alts
              stay as authored). Staggered reveal, parallax depth, slow hover
              zoom — the home-card motion language. */}
          {gallery.length > 0 ? (
            <div
              className={cn(
                "mt-[clamp(2.5rem,5vw,4rem)] grid gap-4",
                mosaic
                  ? "md:h-[clamp(420px,44vw,580px)] md:grid-cols-3 md:grid-rows-[repeat(2,minmax(0,1fr))]"
                  : "md:h-[clamp(300px,34vw,440px)] md:grid-cols-[1.45fr_1fr]",
              )}
            >
              {gallery.map((image, i) => (
                <Reveal
                  key={`${image.src}-${i}`}
                  delay={i * 90}
                  className={cn("min-h-0", mosaic && i === 0 && "md:col-span-2 md:row-span-2")}
                >
                  <div className="group h-[240px] overflow-hidden rounded-lg md:h-full">
                    <Parallax strength={16} scale={1.14} className="h-full">
                      <Picture
                        image={image}
                        sizes={
                          mosaic && i === 0
                            ? "(min-width: 768px) 60vw, 100vw"
                            : "(min-width: 768px) 34vw, 100vw"
                        }
                        className="block h-full"
                        imgClassName="h-full w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                      />
                    </Parallax>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
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
              <span aria-hidden="true" className="mt-6 block h-[3px] w-12 rounded-full bg-bronze-700" />
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
                  <Pill
                    key={model}
                    className="transition-[border-color,background-color] duration-[var(--dur-base)] hover:border-bronze-400 hover:bg-bronze-100"
                  >
                    {model}
                  </Pill>
                ))}
              </div>
              {sector.delivery.secondary ? (
                <div className="mt-8 rounded-lg border border-border border-s-[3px] border-s-bronze-700 bg-surface p-[clamp(1.25rem,2.5vw,1.75rem)] shadow-xs">
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
              {sector.slug === "airports" ? (
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
                  {/* Card image here (the gallery band above shows the full set) */}
                  <div className="group overflow-hidden rounded-lg">
                    <Parallax strength={12} scale={1.1} className="h-full">
                      <Picture
                        image={sector.card}
                        sizes="(min-width: 1024px) 520px, 100vw"
                        className="block"
                        imgClassName="h-[240px] w-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]"
                      />
                    </Parallax>
                  </div>
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

      {/* Why SATCO — distinguished dark-bronze statement block (UCC-reference
          upgrade): bronze-950 field, soft top glow, bronze rule, on-image CTA. */}
      <section
        aria-labelledby={`${sector.slug}-why-h`}
        className="on-dark relative overflow-hidden bg-bronze-950"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(90%_120%_at_50%_0%,rgb(112_64_0/0.32),transparent_70%)]"
        />
        <Container className="relative z-[2] py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <div className="max-w-[860px] border-s-[3px] border-bronze-400 ps-[clamp(1.25rem,3vw,2rem)]">
              <Eyebrow onDark className="mb-4">
                <span id={`${sector.slug}-why-h`}>Why SATCO in {sector.whyLabel}</span>
              </Eyebrow>
              <p className="m-0 text-[clamp(1.15rem,1.9vw,1.45rem)] leading-[1.55] text-stone-50">
                {sector.whySatco}
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-10">
              <ButtonLink href="/contact" variant="onImage">
                {sector.contactCta}
              </ButtonLink>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
