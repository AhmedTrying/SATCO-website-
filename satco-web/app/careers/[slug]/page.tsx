import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { careersPage } from "@/content/careers";
import { sectors } from "@/content/sectors";
import { getJob, getJobs } from "@/lib/jobs";
import { Container } from "@/components/layout/Container";
import { PageHeader } from "@/components/ui/PageHeader";

/*
 * Job detail — LOCKED structure (docx comment #42): role summary,
 * responsibilities, requirements, location, apply button. No PDFs, no
 * email-only workflows; apply opens the ATS/LinkedIn URL.
 *
 * Statically generated from the mock via generateStaticParams — this does not
 * foreclose the live-feed rendering decision (see lib/jobs.ts TODO seam).
 */

export function generateStaticParams() {
  return getJobs().map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const job = getJob((await params).slug);
  return job
    ? { title: `${job.title} — Careers`, description: job.summary }
    : { title: "Role not found" };
}

const sectionHeading = "mb-3 mt-0 font-display text-[1.1rem] font-bold text-strong";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const job = getJob((await params).slug);
  if (!job) notFound();
  const sectorName = sectors.find((s) => s.slug === job.sector)?.name ?? job.sector;
  const level =
    job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1);

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
          { label: job.title },
        ]}
        title={job.title}
        headingId="job-h"
      >
        <div className="mt-3.5 flex flex-wrap gap-2">
          {[sectorName, job.discipline, level].map((tag) => (
            <span
              key={tag}
              className="rounded-[100px] border border-border bg-surface px-3 py-[5px] text-[12.5px] text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </PageHeader>

      <Container className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-start gap-[clamp(2rem,4vw,3.5rem)] py-[clamp(3rem,6vw,5rem)]">
        <div>
          <h2 className={sectionHeading}>{careersPage.detail.summaryHeading}</h2>
          <p className="mb-8 mt-0 max-w-[64ch] text-base leading-[1.7] text-stone-700">
            {job.summary}
          </p>
          <h2 className={sectionHeading}>{careersPage.detail.responsibilitiesHeading}</h2>
          <ul className="m-0 mb-8 flex max-w-[64ch] list-none flex-col gap-2.5 p-0">
            {job.responsibilities.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-stone-700">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-[50%] bg-bronze-500" />
                {item}
              </li>
            ))}
          </ul>
          <h2 className={sectionHeading}>{careersPage.detail.requirementsHeading}</h2>
          <ul className="m-0 flex max-w-[64ch] list-none flex-col gap-2.5 p-0">
            {job.requirements.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.6] text-stone-700">
                <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 flex-none rounded-[50%] bg-bronze-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-lg border border-border bg-surface p-[26px] md:sticky md:top-24">
          <div className="mb-1.5 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-bronze-700">
            {careersPage.detail.locationHeading}
          </div>
          <div className="mb-[22px] text-[15px] text-stone-700">{job.location}</div>
          <a
            href={job.applyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="box-border inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-[22px] py-3.5 text-[15px] font-semibold text-white no-underline transition-colors hover:bg-primary-hover hover:text-white"
          >
            {careersPage.detail.applyLabel}{" "}
            <span aria-hidden="true" className="rtl:-scale-x-100">
              →
            </span>
          </a>
          <p className="mb-0 mt-3.5 text-[12.5px] leading-[1.5] text-stone-600">
            {careersPage.detail.applyNote}
          </p>
          <Link
            href="/careers"
            className="mt-[18px] inline-flex items-center gap-1.5 text-sm font-semibold text-bronze-800 no-underline hover:text-bronze-700"
          >
            <span aria-hidden="true" className="rtl:-scale-x-100">
              ←
            </span>{" "}
            {careersPage.detail.backLabel}
          </Link>
        </aside>
      </Container>
    </>
  );
}
