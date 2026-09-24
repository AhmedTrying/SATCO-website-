import type { Metadata } from "next";

import { LiveJob } from "@/components/careers/LiveJob";
import { getJob, getJobs } from "@/lib/jobs";

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
    ? { title: `${job.title} — Careers`, description: job.summary }
    : { title: "Role not found" };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <LiveJob slug={(await params).slug} />;
}
