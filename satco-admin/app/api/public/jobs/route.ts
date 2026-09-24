import type { Job } from "@satco/shared";
import { isJobDeadlineOpen } from "@satco/shared";

import { adapters } from "@/lib/adapters";

export const runtime = "nodejs";

function publicJob(job: Awaited<ReturnType<typeof adapters.jobs.list>>[number]): Job {
  return Object.fromEntries(
    Object.entries(job).filter(([key]) => !["state", "hiringManager", "createdAt", "updatedAt"].includes(key)),
  ) as Job;
}

/** Public feed for the live Careers page and static site builds. */
export async function GET(): Promise<Response> {
  const jobs = await adapters.jobs.list();
  return Response.json({
    jobs: jobs
      .filter((job) => job.state === "published" && isJobDeadlineOpen(job.applicationDeadline))
      .map(publicJob),
  }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
    },
  });
}
