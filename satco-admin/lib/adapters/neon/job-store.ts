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
  "id, slug, job_reference, title, department, location, sector, discipline, experience_level, type, " +
  "number_of_vacancies, experience_required, education, posted_at, application_deadline, summary, " +
  "responsibilities, requirements, preferred_qualifications, screening_questions, hiring_manager, " +
  "apply_href, source, state, created_at, updated_at";

function jobValues(job: JobRecord): unknown[] {
  return [
    job.id,
    job.slug,
    job.jobReference ?? null,
    job.title,
    job.department ?? null,
    job.location,
    job.sector,
    job.discipline,
    job.experienceLevel,
    job.type ?? null,
    job.numberOfVacancies ?? null,
    job.experienceRequired ?? null,
    job.education ?? null,
    job.postedAt ?? null,
    job.applicationDeadline ?? null,
    job.summary,
    jsonbParam(job.responsibilities),
    jsonbParam(job.requirements),
    jsonbParam(job.preferredQualifications ?? []),
    jsonbParam(job.screeningQuestions ?? []),
    job.hiringManager ?? null,
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
       slug = $2, job_reference = $3, title = $4, department = $5, location = $6,
       sector = $7, discipline = $8, experience_level = $9, type = $10,
       number_of_vacancies = $11, experience_required = $12, education = $13,
       posted_at = $14, application_deadline = $15, summary = $16,
       responsibilities = $17::jsonb, requirements = $18::jsonb,
       preferred_qualifications = $19::jsonb, screening_questions = $20::jsonb,
       hiring_manager = $21, apply_href = $22, source = $23, state = $24,
       updated_at = $25
     where id = $1`,
    [
      updated.id,
      updated.slug,
      updated.jobReference ?? null,
      updated.title,
      updated.department ?? null,
      updated.location,
      updated.sector,
      updated.discipline,
      updated.experienceLevel,
      updated.type ?? null,
      updated.numberOfVacancies ?? null,
      updated.experienceRequired ?? null,
      updated.education ?? null,
      updated.postedAt ?? null,
      updated.applicationDeadline ?? null,
      updated.summary,
      jsonbParam(updated.responsibilities),
      jsonbParam(updated.requirements),
      jsonbParam(updated.preferredQualifications ?? []),
      jsonbParam(updated.screeningQuestions ?? []),
      updated.hiringManager ?? null,
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
    const placeholders = Array.from({ length: 26 }, (_, i) =>
      i >= 16 && i <= 19 ? `$${i + 1}::jsonb` : `$${i + 1}`,
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
