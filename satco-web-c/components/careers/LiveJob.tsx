"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Container } from "@/components/layout/Container";
import { JobApplicationView } from "@/components/careers/JobApplicationView";
import { JobDetailView } from "@/components/careers/JobDetailView";
import { useLiveJobs } from "@/components/careers/useLiveJobs";
import { careersPage } from "@/content/careers";
import { jobApplicationCopy } from "@/content/job-application";

export function LiveJob({ slug, application = false }: { slug: string; application?: boolean }) {
  const { jobs, status } = useLiveJobs();
  const job = jobs.find((candidate) => candidate.slug === slug);

  if (status !== "ready" || !job) {
    const message = status === "loading"
      ? jobApplicationCopy.loadingRole
      : status === "error"
        ? jobApplicationCopy.jobsUnavailable
        : jobApplicationCopy.roleUnavailable;
    return (
      <Container className="py-20">
        <h1 className="font-display text-3xl font-bold text-strong" role="status">{message}</h1>
        {status !== "loading" && (
          <Link href="/careers" className="mt-6 inline-flex font-semibold text-bronze-800">
            {careersPage.detail.backLabel}
          </Link>
        )}
      </Container>
    );
  }

  return application ? <JobApplicationView job={job} /> : <JobDetailView job={job} />;
}

export function LiveJobFromQuery({ application = false }: { application?: boolean }) {
  const searchParams = useSearchParams();
  return <LiveJob slug={searchParams.get("slug") ?? ""} application={application} />;
}
