import type { Metadata } from "next";
import { careersPage } from "@/content/careers";
import { getJobs } from "@/lib/jobs";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";
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

      <section aria-labelledby="life-h" className="border-b border-border bg-surface">
        <Container className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3.5rem,7vw,6rem)]">
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
          <Reveal delay={100}>
            <Picture
              image={{
                src: "maintenance",
                alt: "A SATCO technician working at height against a golden sunset",
              }}
              sizes="(min-width: 1024px) 520px, 100vw"
              imgClassName="w-full rounded-lg object-cover object-[center_30%]"
              style={{ height: "clamp(280px,36vw,420px)" }}
            />
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
          <ol className="m-0 mt-[clamp(1.5rem,3vw,2.25rem)] grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[22px] p-0">
            {careersPage.howWeHire.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 70}>
                  <div className="h-full rounded-lg border border-border bg-surface p-[26px]">
                    <div aria-hidden="true" className="mb-3.5 font-display text-sm font-bold text-bronze-700">
                      Step {String(i + 1).padStart(2, "0")}
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

      <section id="general-application" aria-labelledby="genapp-h" className="on-dark bg-bronze-950">
        <Container className="py-[clamp(3.5rem,7vw,6rem)] text-center">
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
