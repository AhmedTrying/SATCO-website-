import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JobApplicationForm } from "@/components/careers/JobApplicationForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Container } from "@/components/layout/Container";
import { jobApplicationCopy as copy } from "@/content/job-application";
import { formatJobDeadline, getJob, getJobs } from "@/lib/jobs";

export async function generateStaticParams() {
  return (await getJobs()).map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const job = await getJob((await params).slug);
  return job
    ? { title: `${copy.titlePrefix} ${job.title}`, description: copy.lead }
    : { title: "Role not found" };
}

export default async function JobApplicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const job = await getJob((await params).slug);
  if (!job) notFound();

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
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(29_26_22/0.98)_0%,rgb(29_26_22/0.94)_46%,rgb(29_26_22/0.55)_75%,rgb(29_26_22/0.2)_100%)]"
        />

        <Container className="py-[clamp(2.25rem,5vw,4rem)]">
          <Breadcrumbs
            onDark
            items={[
              { label: "Home", href: "/" },
              { label: "Careers", href: "/careers" },
              { label: job.title, href: `/careers/${job.slug}` },
              { label: "Apply" },
            ]}
          />
          <div className="mb-3 text-[12px] font-bold uppercase tracking-[0.16em] text-bronze-300">
            {copy.eyebrow}
          </div>
          <h1
            id="application-h"
            className="m-0 max-w-[25ch] font-display text-[clamp(2rem,5vw,3.2rem)] font-bold leading-[1.06] tracking-[-0.025em] text-white [text-wrap:balance]"
          >
            {copy.titlePrefix} {job.title}
          </h1>
          <p className="mb-0 mt-5 max-w-[62ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.65] text-stone-100">
            {copy.lead}
          </p>
        </Container>
      </section>

      <Container className="grid items-start gap-[clamp(2rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <JobApplicationForm job={job} />

        <aside className="rounded-lg border border-border bg-sand p-6 lg:sticky lg:top-24">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-bronze-700">
            {copy.roleSummaryHeading}
          </div>
          <h2 className="mb-4 mt-0 font-display text-xl font-bold leading-tight text-strong">
            {job.title}
          </h2>
          <div className="border-t border-stone-300 pt-4">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
              {copy.locationLabel}
            </div>
            <div className="mt-1 text-sm text-stone-800">{job.location}</div>
          </div>
          {job.experienceRequired && (
            <div className="mt-4 border-t border-stone-300 pt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                {copy.experienceRequiredLabel}
              </div>
              <div className="mt-1 text-sm text-stone-800">{job.experienceRequired}</div>
            </div>
          )}
          {job.education && (
            <div className="mt-4 border-t border-stone-300 pt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                {copy.educationLabel}
              </div>
              <div className="mt-1 text-sm text-stone-800">{job.education}</div>
            </div>
          )}
          {job.applicationDeadline && (
            <div className="mt-4 border-t border-stone-300 pt-4">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-600">
                {copy.applicationDeadlineLabel}
              </div>
              <div className="mt-1 text-sm text-stone-800">{formatJobDeadline(job.applicationDeadline)}</div>
            </div>
          )}
          <Link
            href={`/careers/${job.slug}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-bronze-800 no-underline hover:text-bronze-700"
          >
            <span aria-hidden="true">←</span> {copy.backToRole}
          </Link>
        </aside>
      </Container>
    </>
  );
}
