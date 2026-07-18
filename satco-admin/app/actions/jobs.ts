"use server";

import { revalidatePath } from "next/cache";

import type { JobRecord, JobState } from "@satco/shared";
import { jobSchema, jobStateSchema } from "@satco/shared/schemas";
import { z } from "zod";

import { adapters } from "@/lib/adapters";
import type { JobInput } from "@/lib/adapters/types";
import { requireCapability } from "@/lib/auth";

export interface JobResult {
  ok: boolean;
  error?: string;
  job?: JobRecord;
}

// Allow an empty id on create (the store mints one); apply-URL rule enforced by jobSchema.
const jobInputSchema = jobSchema.extend({
  id: z.string(),
  state: jobStateSchema,
});

function fail(e: unknown): JobResult {
  if (e instanceof z.ZodError) {
    const i = e.issues[0];
    return { ok: false, error: `${i.path.join(".") || "value"}: ${i.message}` };
  }
  return { ok: false, error: e instanceof Error ? e.message : "Failed" };
}

export async function saveJob(data: unknown): Promise<JobResult> {
  try {
    const session = await requireCapability("edit");
    const input = jobInputSchema.parse(data) as JobInput;
    const existing = input.id ? await adapters.jobs.get(input.slug) : undefined;
    let job: JobRecord;
    if (input.id && existing) {
      job = await adapters.jobs.update(input.id, input);
    } else {
      job = await adapters.jobs.create(input);
    }
    await adapters.audit.append({
      actor: session.email,
      action: input.id && existing ? "job.update" : "job.create",
      entity: "job",
      entityId: job.id,
      summary: `${input.id && existing ? "Updated" : "Created"} job: ${job.title}.`,
    });
    revalidatePath("/careers");
    return { ok: true, job };
  } catch (e) {
    return fail(e);
  }
}

export async function setJobState(id: string, state: JobState): Promise<JobResult> {
  try {
    const session = await requireCapability("manageJobs");
    const parsed = jobStateSchema.parse(state);
    const job = await adapters.jobs.setState(id, parsed);
    await adapters.audit.append({
      actor: session.email,
      action: "job.setState",
      entity: "job",
      entityId: id,
      summary: `Job "${job.title}" → ${parsed}.`,
    });
    revalidatePath("/careers");
    return { ok: true, job };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteJob(id: string): Promise<JobResult> {
  try {
    const session = await requireCapability("admin");
    await adapters.jobs.remove(id);
    await adapters.audit.append({
      actor: session.email,
      action: "job.delete",
      entity: "job",
      entityId: id,
      summary: `Deleted job ${id}.`,
    });
    revalidatePath("/careers");
    return { ok: true };
  } catch (e) {
    return fail(e);
  }
}
