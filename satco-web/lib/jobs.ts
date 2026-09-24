import { jobs as snapshotJobs } from "@/content/jobs";
import type { Job } from "@/lib/types";

/* Vercel prebuild refreshes the jobs snapshot from the dashboard API (or Neon)
 * before Next.js generates Careers routes. Other hosts may use an explicit API. */
export async function getJobs(): Promise<Job[]> {
  if (process.env.VERCEL || process.env.DATABASE_URL) return snapshotJobs;
  const endpoint = process.env.CAREERS_JOBS_API_URL?.trim();
  if (!endpoint) return snapshotJobs;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return snapshotJobs;
    const body = (await response.json()) as { jobs?: Job[] };
    return Array.isArray(body.jobs) ? body.jobs : snapshotJobs;
  } catch {
    return snapshotJobs;
  }
}

export async function getJob(slug: string): Promise<Job | undefined> {
  return (await getJobs()).find((j) => j.slug === slug);
}

export function formatJobDeadline(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export interface JobFilterState {
  keyword: string;
  location: string;
  sector: string;
  discipline: string;
  level: string;
}

export const emptyFilters: JobFilterState = {
  keyword: "",
  location: "",
  sector: "",
  discipline: "",
  level: "",
};

export function filterJobs(all: Job[], f: JobFilterState): Job[] {
  const kw = f.keyword.trim().toLowerCase();
  return all.filter((j) => {
    const haystack = `${j.title} ${j.sector} ${j.discipline} ${j.location}`.toLowerCase();
    if (kw && !haystack.includes(kw)) return false;
    if (f.location && j.location !== f.location) return false;
    if (f.sector && j.sector !== f.sector) return false;
    if (f.discipline && j.discipline !== f.discipline) return false;
    if (f.level && j.experienceLevel !== f.level) return false;
    return true;
  });
}

export function uniqueValues<K extends keyof Job>(all: Job[], key: K): Job[K][] {
  return [...new Set(all.map((j) => j[key]))];
}
