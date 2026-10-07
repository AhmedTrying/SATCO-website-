/*
 * Prebuild: refresh content/generated/jobs.json with the PUBLISHED jobs from the
 * dashboard's public API (Neon as a fallback when DATABASE_URL is set). Runs
 * before `next build` through the "prebuild" script.
 *
 * Page copy is no longer fetched from anywhere: content/generated/*.json is
 * edited in code and committed (2026-10-07, dashboard simplified to careers +
 * inquiries). The committed jobs.json is the offline fallback. The dashboard's
 * Careers deploy hook triggers a rebuild after jobs change.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { Job } from "@satco/shared";

interface PublishedJobRow {
  id: string;
  slug: string;
  job_reference: string | null;
  title: string;
  department: string | null;
  location: string;
  sector: Job["sector"];
  discipline: string;
  experience_level: Job["experienceLevel"];
  type: Job["type"] | null;
  number_of_vacancies: number | null;
  experience_required: string | null;
  education: string | null;
  posted_at: string | Date | null;
  application_deadline: string | Date | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  preferred_qualifications: string[] | null;
  screening_questions: Job["screeningQuestions"] | null;
  apply_href: string;
  source: Job["source"];
}

function timestamp(value: string | Date | null): string | undefined {
  return value == null ? undefined : new Date(value).toISOString();
}

function publicJob(row: PublishedJobRow): Job {
  return {
    id: row.id,
    slug: row.slug,
    jobReference: row.job_reference ?? undefined,
    title: row.title,
    department: row.department ?? undefined,
    location: row.location,
    sector: row.sector,
    discipline: row.discipline,
    experienceLevel: row.experience_level,
    type: row.type ?? undefined,
    numberOfVacancies: row.number_of_vacancies ?? undefined,
    experienceRequired: row.experience_required ?? undefined,
    education: row.education ?? undefined,
    postedAt: timestamp(row.posted_at),
    applicationDeadline: timestamp(row.application_deadline),
    summary: row.summary,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    preferredQualifications: row.preferred_qualifications ?? [],
    screeningQuestions: row.screening_questions ?? [],
    applyHref: row.apply_href,
    source: row.source,
  };
}

const url = process.env.DATABASE_URL;
const dir = fileURLToPath(new URL("../content/generated/", import.meta.url));
const sql = url
  ? await import("@neondatabase/serverless")
      .then(({ neon }) => neon(url))
      .catch((err: unknown) => {
        console.warn(
          "[fetch-content] Neon client unavailable — jobs will come from the dashboard API or committed JSON. " +
            (err instanceof Error ? err.message : String(err)),
        );
        return undefined;
      })
  : undefined;

const endpoints = new Set<string>();
if (process.env.CAREERS_JOBS_API_URL?.trim()) {
  endpoints.add(process.env.CAREERS_JOBS_API_URL.trim());
}
if (process.env.NEXT_PUBLIC_CAREERS_API_URL?.trim()) {
  try {
    endpoints.add(new URL("/api/public/jobs", process.env.NEXT_PUBLIC_CAREERS_API_URL).toString());
  } catch {
    console.warn("[fetch-content] Invalid careers application URL — trying another jobs source.");
  }
}
if (process.env.VERCEL) endpoints.add("https://satco-dashboard.vercel.app/api/public/jobs");

let jobs: Job[] | undefined;
for (const endpoint of endpoints) {
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = (await response.json()) as { jobs?: Job[] };
    if (!Array.isArray(body.jobs)) throw new Error("Response has no jobs array");
    jobs = body.jobs;
    console.log(`[fetch-content] fetched ${jobs.length} published jobs from dashboard API.`);
    break;
  } catch (err) {
    console.warn(
      "[fetch-content] Dashboard jobs API failed — trying another source. " +
        (err instanceof Error ? err.message : String(err)),
    );
  }
}

if (!jobs && sql) try {
  const rows = (await sql.query(
    "select * from jobs where state = 'published' order by created_at desc, seq asc",
  )) as PublishedJobRow[];
  jobs = rows.map(publicJob);
  console.log(`[fetch-content] fetched ${jobs.length} published jobs from Neon.`);
} catch (err) {
  console.warn(
    "[fetch-content] Neon jobs fetch failed — using committed jobs JSON. " +
      (err instanceof Error ? err.message : String(err)),
  );
}

if (jobs) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(dir + "jobs.json", JSON.stringify(jobs, null, 2) + "\n", "utf8");
  console.log(`[fetch-content] wrote ${jobs.length} published jobs to the build snapshot.`);
} else {
  if (process.env.VERCEL) {
    throw new Error("[fetch-content] No live jobs source; refusing to deploy stale Careers pages.");
  }
  console.warn("[fetch-content] No live jobs source — using committed jobs JSON locally.");
}
