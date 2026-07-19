/*
 * Neon JobStore — the `jobs` table. Mirrors the local store's read-modify-write
 * semantics (patch merges onto the existing record, id preserved, updatedAt stamped)
 * so behaviour is identical to the JSON backend. Interface unchanged.
 */

import type { JobRecord, JobState } from "@satco/shared";

import type { JobInput, JobStore } from "../types";
import { makeId } from "../local/store";
import { query, queryOne, jsonbParam } from "../../db";
import { toJob, type JobRow } from "./mappers";

const INSERT_COLUMNS =
  "id, slug, title, location, sector, discipline, experience_level, type, posted_at, " +
  "summary, responsibilities, requirements, apply_href, source, state, created_at, updated_at";

function jobValues(job: JobRecord): unknown[] {
  return [
    job.id,
    job.slug,
    job.title,
    job.location,
    job.sector,
    job.discipline,
    job.experienceLevel,
    job.type ?? null,
    job.postedAt ?? null,
    job.summary,
    jsonbParam(job.responsibilities),
    jsonbParam(job.requirements),
    job.applyHref,
    job.source,
    job.state,
    job.createdAt,
    job.updatedAt,
  ];
}

async function patchJob(id: string, patch: Partial<JobInput>): Promise<JobRecord> {
  const existingRow = await queryOne<JobRow>("select * from jobs where id = $1", [id]);
  if (!existingRow) throw new Error(`Job ${id} not found`);
  const updated: JobRecord = {
    ...toJob(existingRow),
    ...patch,
    id: existingRow.id,
    updatedAt: new Date().toISOString(),
  };
  await query(
    `update jobs set
       slug = $2, title = $3, location = $4, sector = $5, discipline = $6,
       experience_level = $7, type = $8, posted_at = $9, summary = $10,
       responsibilities = $11::jsonb, requirements = $12::jsonb, apply_href = $13,
       source = $14, state = $15, updated_at = $16
     where id = $1`,
    [
      updated.id,
      updated.slug,
      updated.title,
      updated.location,
      updated.sector,
      updated.discipline,
      updated.experienceLevel,
      updated.type ?? null,
      updated.postedAt ?? null,
      updated.summary,
      jsonbParam(updated.responsibilities),
      jsonbParam(updated.requirements),
      updated.applyHref,
      updated.source,
      updated.state,
      updated.updatedAt,
    ],
  );
  return updated;
}

export const neonJobStore: JobStore = {
  async list(): Promise<JobRecord[]> {
    const rows = await query<JobRow>(
      "select * from jobs order by created_at desc, seq asc",
    );
    return rows.map(toJob);
  },

  async get(slug: string): Promise<JobRecord | undefined> {
    const row = await queryOne<JobRow>("select * from jobs where slug = $1", [slug]);
    return row ? toJob(row) : undefined;
  },

  async create(job: JobInput): Promise<JobRecord> {
    const now = new Date().toISOString();
    const record: JobRecord = {
      ...job,
      id: job.id || makeId("job"),
      createdAt: now,
      updatedAt: now,
    };
    const placeholders = Array.from({ length: 17 }, (_, i) =>
      i === 10 || i === 11 ? `$${i + 1}::jsonb` : `$${i + 1}`,
    ).join(", ");
    await query(
      `insert into jobs (${INSERT_COLUMNS}) values (${placeholders})`,
      jobValues(record),
    );
    return record;
  },

  update(id: string, patch: Partial<JobInput>): Promise<JobRecord> {
    return patchJob(id, patch);
  },

  setState(id: string, state: JobState): Promise<JobRecord> {
    return patchJob(id, { state });
  },

  async remove(id: string): Promise<void> {
    await query("delete from jobs where id = $1", [id]);
  },
};
