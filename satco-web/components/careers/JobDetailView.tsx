"use client";

import Link from "next/link";

import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { careersPage } from "@/content/careers";
import { jobApplicationCopy } from "@/content/job-application";
import { sectors } from "@/content/sectors";
import { formatJobDeadline } from "@/lib/jobs";
import type { Job } from "@/lib/types";

const levelLabels: Record<Job["experienceLevel"], string> = {
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior-level",
  lead: "Lead",
  executive: "Executive",
};

const sectionHeading =
  "mb-3 mt-0 font-display text-[clamp(1.45rem,2.5vw,1.85rem)] font-bold tracking-[-0.015em] text-strong";
const sectionRule = "mb-4 h-[2px] w-10 bg-bronze-700";
const bulletItem = "flex items-start gap-3 text-[15.5px] leading-[1.65] text-stone-700";
const bulletDot = "mt-[10px] h-1.5 w-1.5 flex-none rounded-full bg-bronze-600";

function MetaIcon({
  kind,
}: {
  kind: "location" | "department" | "sector" | "level" | "education" | "deadline";
}) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 28 28",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (kind === "location") {
    return (
      <svg {...common}>
        <path d="M22 11.6c0 6-8 13-8 13s-8-7-8-13a8 8 0 1 1 16 0Z" />
        <circle cx="14" cy="11.5" r="2.7" />
      </svg>
    );
  }
  if (kind === "department") {
    return (
      <svg {...common}>
        <path d="M5 24V6h12v18M17 12h6v12M9 10h2m2 0h1m-5 4h2m2 0h1m-5 4h2m2 0h1m6-2h1m-1 4h1M3 24h22" />
      </svg>
    );
  }
  if (kind === "sector") {
    return (
      <svg {...common}>
        <path d="m14 3 10 5-10 5L4 8l10-5Z" />
        <path d="m4 13 10 5 10-5M4 18l10 5 10-5" />
      </svg>
    );
  }
  if (kind === "education") {
    return (
      <svg {...common}>
        <path d="m14 3 10 5-10 5L4 8l10-5Z" />
        <path d="M7 10.5v5.7c0 2.1 3.1 4.1 7 4.1s7-2 7-4.1v-5.7" />
      </svg>
    );
  }
  if (kind === "deadline") {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="20" height="18" rx="2" />
        <path d="M9 3v6m10-6v6M4 12h20m-14 4h4m-4 4h8" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M5 24V16h4v8M12 24V10h4v14M19 24V4h4v20M3 24h22" />
    </svg>
  );
}

function MetaRow({
  kind,
  label,
  value,
}: {
  kind: "location" | "department" | "sector" | "level" | "education" | "deadline";
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-[34px_minmax(0,1fr)] gap-4">
      <span className="text-bronze-700">
        <MetaIcon kind={kind} />
      </span>
      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-bronze-800">
          {label}
        </div>
        <div className="mt-0.5 text-[15px] leading-[1.45] text-stone-700">{value}</div>
      </div>
    </div>
  );
}

export function JobDetailView({ job }: { job: Job }) {
  const sectorName = sectors.find((sector) => sector.slug === job.sector)?.name ?? job.sector;
  const level = levelLabels[job.experienceLevel];
  const applyHref = `/careers/role/apply?slug=${encodeURIComponent(job.slug)}`;

  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-stone-950 text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-[center_right] bg-no-repeat"
          style={{ backgroundImage: "url('/images/careers-role-line-art.png')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(29_26_22/0.98)_0%,rgb(29_26_22/0.94)_42%,rgb(29_26_22/0.52)_72%,rgb(29_26_22/0.18)_100%)]"
        />

        <Container className="py-[clamp(2.25rem,5vw,4rem)]">
          <Breadcrumbs
            onDark
            items={[
              { label: "Home", href: "/" },
              { label: "Careers", href: "/careers" },
              { label: job.title },
            ]}
          />

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-bronze-300">
                {jobApplicationCopy.detailEyebrow}
              </div>
              <h1
                id="job-h"
                className="m-0 max-w-[24ch] font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.06] tracking-[-0.025em] text-white [text-wrap:balance]"
              >
                {job.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-y-3 text-[13.5px] text-stone-100">
                {[sectorName, job.discipline, level, job.location].map((item, index) => (
                  <span
                    key={item}
                    className={index === 0 ? "pe-4" : "border-s border-white/35 px-4"}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href={applyHref}
              className="inline-flex min-w-[230px] items-center justify-center gap-2 rounded-sm bg-[linear-gradient(100deg,#9b5900,#d18a20)] px-7 py-4 text-[15px] font-bold text-white no-underline shadow-md transition-[gap,filter,transform] duration-[var(--dur-base)] hover:-translate-y-0.5 hover:gap-3 hover:text-white hover:brightness-110"
            >
              {careersPage.detail.applyLabel}
              <span aria-hidden="true" className="rtl:-scale-x-100">
                →
              </span>
            </Link>
          </div>
        </Container>
      </section>

      <Container className="grid items-start gap-[clamp(2.75rem,6vw,5rem)] py-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1.45fr)_minmax(310px,0.78fr)]">
        <div>
          <Reveal>
            <div aria-hidden="true" className={sectionRule} />
            <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-bronze-800">
              {jobApplicationCopy.overviewEyebrow}
            </div>
            <h2 className={sectionHeading}>{careersPage.detail.summaryHeading}</h2>
            <p className="m-0 max-w-[66ch] text-[16px] leading-[1.72] text-stone-700">
              {job.summary}
            </p>
          </Reveal>

          <Reveal className="mt-12">
            <div aria-hidden="true" className={sectionRule} />
            <h2 className={sectionHeading}>{careersPage.detail.responsibilitiesHeading}</h2>
            <ul className="m-0 flex max-w-[66ch] list-none flex-col gap-2.5 p-0">
              {job.responsibilities.map((item, index) => (
                <li key={`${item}-${index}`} className={bulletItem}>
                  <span aria-hidden="true" className={bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-12">
            <div aria-hidden="true" className={sectionRule} />
            <h2 className={sectionHeading}>{careersPage.detail.requirementsHeading}</h2>
            <ul className="m-0 flex max-w-[66ch] list-none flex-col gap-2.5 p-0">
              {job.requirements.map((item, index) => (
                <li key={`${item}-${index}`} className={bulletItem}>
                  <span aria-hidden="true" className={bulletDot} />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120} className="lg:sticky lg:top-[calc(var(--nav-h)+24px)]">
          <aside className="relative overflow-hidden rounded-lg border border-border bg-surface p-[clamp(1.4rem,3vw,2rem)] shadow-md">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-bronze-700" />
            <h2 className="mb-7 mt-0 text-[12px] font-bold uppercase tracking-[0.14em] text-bronze-800">
              {jobApplicationCopy.cardHeading}
            </h2>

            <div className="flex flex-col gap-6">
              <MetaRow
                kind="location"
                label={careersPage.detail.locationHeading}
                value={job.location}
              />
              <MetaRow
                kind="department"
                label={jobApplicationCopy.departmentLabel}
                value={job.discipline}
              />
              <MetaRow
                kind="sector"
                label={jobApplicationCopy.sectorLabel}
                value={sectorName}
              />
              <MetaRow
                kind="level"
                label={jobApplicationCopy.levelLabel}
                value={level}
              />
              {job.experienceRequired && (
                <MetaRow
                  kind="level"
                  label={jobApplicationCopy.experienceRequiredLabel}
                  value={job.experienceRequired}
                />
              )}
              {job.education && (
                <MetaRow
                  kind="education"
                  label={jobApplicationCopy.educationLabel}
                  value={job.education}
                />
              )}
              {job.applicationDeadline && (
                <MetaRow
                  kind="deadline"
                  label={jobApplicationCopy.applicationDeadlineLabel}
                  value={formatJobDeadline(job.applicationDeadline)}
                />
              )}
            </div>

            <div className="mt-7 border-t border-stone-300 pt-5">
              <Link
                href={applyHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[linear-gradient(100deg,#9b5900,#c87c0d)] px-5 py-3.5 text-[15px] font-bold text-white no-underline transition-[gap,filter] duration-[var(--dur-base)] hover:gap-3 hover:text-white hover:brightness-110"
              >
                {careersPage.detail.applyLabel}
                <span aria-hidden="true" className="rtl:-scale-x-100">
                  →
                </span>
              </Link>
              <p className="mb-0 mt-3 text-[12.5px] leading-[1.5] text-stone-600">
                {jobApplicationCopy.applyNote}
              </p>
            </div>

            <div className="mt-5 border-t border-stone-300 pt-5">
              <Link
                href="/careers"
                className="inline-flex items-center gap-2 text-sm font-semibold text-bronze-800 no-underline transition-colors hover:text-bronze-700"
              >
                <span aria-hidden="true" className="rtl:-scale-x-100">
                  ←
                </span>
                {careersPage.detail.backLabel}
              </Link>
            </div>
          </aside>
        </Reveal>
      </Container>
    </>
  );
}
