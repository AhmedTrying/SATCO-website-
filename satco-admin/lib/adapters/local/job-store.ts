/*
 * Local JobStore — jobs CRUD as JSON, seeded from the site's Job mock.
 * TODO(supabase): a `jobs` table (+ optional feed importer). Interface unchanged.
 */

import type { JobRecord, JobState } from "@satco/shared";

import type { JobInput, JobStore } from "../types";
import { makeId, readStore, writeStore } from "./store";

const FILE = "jobs.json";

async function all(): Promise<JobRecord[]> {
  return readStore<JobRecord[]>(FILE);
}

async function patchJob(id: string, patch: Partial<JobInput>): Promise<JobRecord> {
  const jobs = await all();
  const i = jobs.findIndex((j) => j.id === id);
  if (i < 0) throw new Error(`Job ${id} not found`);
  const updated: JobRecord = {
    ...jobs[i],
    ...patch,
    id: jobs[i].id,
    updatedAt: new Date().toISOString(),
  };
  jobs[i] = updated;
  await writeStore(FILE, jobs);
  return updated;
}

export const localJobStore: JobStore = {
  list(): Promise<JobRecord[]> {
    return all();
  },

  async get(slug: string): Promise<JobRecord | undefined> {
    return (await all()).find((j) => j.slug === slug);
  },

  async create(job: JobInput): Promise<JobRecord> {
    const jobs = await all();
    const now = new Date().toISOString();
    const record: JobRecord = {
      ...job,
      id: job.id || makeId("job"),
      createdAt: now,
      updatedAt: now,
    };
    jobs.unshift(record);
    await writeStore(FILE, jobs);
    return record;
  },

  update(id: string, patch: Partial<JobInput>): Promise<JobRecord> {
    return patchJob(id, patch);
  },

  setState(id: string, state: JobState): Promise<JobRecord> {
    return patchJob(id, { state });
  },

  async remove(id: string): Promise<void> {
    const jobs = (await all()).filter((j) => j.id !== id);
    await writeStore(FILE, jobs);
  },
};
