import { access, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Job, JobRecord } from "@satco/shared";

function publicJob(job: JobRecord): Job {
  return Object.fromEntries(
    Object.entries(job).filter(([key]) => !["state", "hiringManager", "createdAt", "updatedAt"].includes(key)),
  ) as Job;
}

async function generatedJobsPath(): Promise<string | undefined> {
  const fromAdmin = path.resolve(process.cwd(), "..", "satco-web", "content", "generated");
  const fromRoot = path.resolve(process.cwd(), "satco-web", "content", "generated");
  try {
    await access(fromAdmin);
    return path.join(fromAdmin, "jobs.json");
  } catch {
    try {
      await access(fromRoot);
      return path.join(fromRoot, "jobs.json");
    } catch {
      return undefined;
    }
  }
}

/**
 * Makes locally managed published jobs available to the statically built public
 * site. Hosted deployments use the same data through the public jobs API and an
 * optional deploy hook; their read-only filesystem simply skips this local mirror.
 */
export async function refreshPublicJobs(
  jobs: JobRecord[],
  { deploy = false }: { deploy?: boolean } = {},
): Promise<void> {
  const output = await generatedJobsPath();
  if (output) {
    try {
      await writeFile(
        output,
        `${JSON.stringify(jobs.filter((job) => job.state === "published").map(publicJob), null, 2)}\n`,
        "utf8",
      );
    } catch (error) {
      // Vercel's server filesystem is read-only. The build-time API source below
      // is used there, while local development keeps the committed JSON mirror.
      if (!(error instanceof Error) || !/read-only|EROFS|EPERM/i.test(error.message)) {
        throw error;
      }
    }
  }

  const hook = (process.env.CAREERS_DEPLOY_HOOK_URL ?? process.env.VERCEL_DEPLOY_HOOK_URL)?.trim();
  if (deploy && hook) {
    const response = await fetch(hook, { method: "POST" });
    if (!response.ok) throw new Error("The Careers deployment hook did not accept the update.");
  }
}
