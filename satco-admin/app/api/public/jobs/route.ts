import type { Job } from "@satco/shared";

import { adapters } from "@/lib/adapters";

export const runtime = "nodejs";

function publicJob(job: Awaited<ReturnType<typeof adapters.jobs.list>>[number]): Job {
  return Object.fromEntries(
    Object.entries(job).filter(([key]) => !["state", "hiringManager", "createdAt", "updatedAt"].includes(key)),
  ) as Job;
}

/** Public, read-only feed used by the static SATCO website at build time. */
export async function GET(): Promise<Response> {
  const jobs = await adapters.jobs.list();
  return Response.json({
    jobs: jobs.filter((job) => job.state === "published").map(publicJob),
  });
}
