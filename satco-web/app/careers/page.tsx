import type { Metadata } from "next";
import { careersPage } from "@/content/careers";
import { getJobs } from "@/lib/jobs";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Picture } from "@/components/ui/Picture";
import { JobBoard } from "@/components/careers/JobBoard";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work on complex, large-scale projects that support national development — explore open roles across SATCO's four operating sectors.",
};

/* Careers — copy verbatim docx; no PDFs, no email-only workflows (locked). */
export default function CareersPage() {
  const jobs = getJobs();
  return (
    <>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        title={careersPage.title}
        headingId="careers-h"
        lead={careersPage.intro[0]}
      >
        <p className="mb-0 mt-3 max-w-[68ch] text-[15.5px] leading-[1.65] text-stone-600">
          {careersPage.intro[1]}
        </p>
      </PageHeader>

      {/* Cinematic band under the header (UCC-reference rhythm). Decorative
          stock imagery — neutral, no SATCO claim — so it is hidden from AT. */}
      <div aria-hidden="true" className="relative overflow-hidden border-b border-border">
        <Parallax strength={40} scale={1.14}>
          <Picture
            image={{ src: "team-2", alt: "" }}
            sizes="100vw"
            imgClassName="w-full object-cover object-[center_40%]"
            style={{ height: "clamp(240px,36vw,440px)" }}
          />
        </Parallax>
      </div>

      <section aria-labelledby="life-h" className="border-b border-border bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2rem,4vw,3.5rem)] pb-[clamp(4.5rem,8vw,7rem)] pt-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <Eyebrow className="mb-4">{careersPage.life.eyebrow}</Eyebrow>
            <h2
              id="life-h"
              className="mb-5 mt-0 max-w-[20ch] font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong"
            >
              {careersPage.life.heading}
            </h2>
            {careersPage.life.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mb-4 mt-0 max-w-[60ch] text-base leading-[1.72] text-stone-700 last:mb-0">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={120} className="relative">
            {/* Layered depth (WhoWeAre pattern): the main image drifts up while
                the portrait card drifts the opposite way. Positioning classes
                stay on the outer divs — Parallax owns only the inner transform. */}
            <div className="overflow-hidden rounded-lg">
              <Parallax strength={26} scale={1.1}>
                <Picture
                  image={{
                    src: "team-1",
                    alt: "Engineers reviewing construction drawings on site",
                  }}
                  sizes="(min-width: 1024px) 560px, 100vw"
                  imgClassName="w-full object-cover"
                  style={{ height: "clamp(300px,38vw,460px)" }}
                />
              </Parallax>
            </div>
            <div className="absolute bottom-0 start-0 w-[clamp(150px,30%,210px)] translate-y-[24%] ltr:-translate-x-[6%] rtl:translate-x-[6%]">
              <Parallax strength={-14}>
                <Picture
                  image={{
                    src: "maintenance",
                    alt: "A SATCO technician working at height against a golden sunset",
                  }}
                  sizes="210px"
                  imgClassName="w-full rounded-md object-cover object-[center_30%] shadow-lg"
                  style={{ height: "clamp(190px,26vw,260px)" }}
                />
              </Parallax>
            </div>
          </Reveal>
        </Container>
      </section>

      <section aria-labelledby="roles-h" className="bg-bg">
        <Container className="py-[var(--section-y)]">
          <Reveal>
            <h2
              id="roles-h"
              className="mb-2 mt-0 font-display text-[clamp(1.7rem,3.2vw,2.3rem)] font-bold leading-[1.14] tracking-[-0.015em] text-strong"
            >
              {careersPage.roles.heading}
            </h2>
            {/* ⚠ Mock listings — live LinkedIn/ATS feed is a TODO seam (lib/jobs.ts) */}
            <p className="mb-7 mt-0 text-sm text-stone-600">{careersPage.roles.note}</p>
          </Reveal>
          <JobBoard jobs={jobs} />
        </Container>
      </section>

      <section aria-labelledby="hire-h" className="border-t border-border bg-sand">
        <Container className="py-[clamp(3.5rem,7vw,6rem)]">
          <Reveal>
            <h2
              id="hire-h"
              className="mb-4 mt-0 font-display text-[clamp(1.7rem,3.2vw,2.3rem)] font-bold leading-[1.14] tracking-[-0.015em] text-strong"
            >
              {careersPage.howWeHire.heading}
            </h2>
            {careersPage.howWeHire.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="mb-3.5 mt-0 max-w-[70ch] text-base leading-[1.68] text-stone-700">
                {p}
              </p>
            ))}
          </Reveal>
          {/* Numbered rhythm: hairline + bronze tick + ghost numeral per step.
              Order is conveyed by the <ol>; the numerals are decorative. */}
          <ol className="m-0 mt-[clamp(2rem,4vw,3rem)] grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-7 gap-y-9 p-0">
            {careersPage.howWeHire.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 90} className="h-full">
                  <div className="relative h-full border-t border-stone-300 pt-5">
                    <span aria-hidden="true" className="absolute -top-px start-0 h-[2px] w-12 bg-bronze-700" />
                    <div
                      aria-hidden="true"
                      className="mb-3 font-display text-[clamp(2.2rem,3.4vw,2.8rem)] font-bold leading-none text-bronze-300 tabular-nums"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mb-2 mt-0 font-display text-[1.1rem] font-bold text-strong">
                      {step.title}
                    </h3>
                    <p className="m-0 text-[14.5px] leading-[1.6] text-body">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        id="general-application"
        aria-labelledby="genapp-h"
        className="on-dark relative overflow-hidden bg-bronze-950"
      >
        {/* Background drifts slower than the scroll (scale hides the edges) */}
        <Parallax strength={40} scale={1.12} className="absolute inset-0">
          <Picture
            image={{ src: "construction-2", alt: "" }}
            sizes="100vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            style={{ height: "100%", width: "100%" }}
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgb(29_26_22/0.88),rgb(53_30_3/0.84))]"
        />
        <Container className="relative z-[2] py-[clamp(4rem,8vw,7rem)] text-center">
          <Reveal>
            <h2
              id="genapp-h"
              className="mb-3.5 mt-0 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold leading-[1.16] tracking-[-0.015em] text-white [text-wrap:balance]"
            >
              {careersPage.generalApplication.heading}
            </h2>
            <p className="mx-auto mb-7 mt-0 max-w-[52ch] text-base leading-[1.6] text-bronze-200">
              {careersPage.generalApplication.body}
            </p>
            <ButtonLink href="/contact" variant="onImage">
              {careersPage.generalApplication.cta}
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
