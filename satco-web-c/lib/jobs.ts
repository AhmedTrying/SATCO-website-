import { jobs as mockJobs } from "@/content/jobs";
import type { Job } from "@/lib/types";

/*
 * ============================================================================
 * TODO — LIVE JOB FEED ADAPTER SEAM (docx comment #42 / plan §12 Q7)
 * ============================================================================
 * The live source will be the LinkedIn Jobs API or the internal ATS — which one
 * is UNDECIDED, as is the static-export strategy for detail pages:
 *   (a) client-rendered detail view fetching the feed in the browser,
 *   (b) webhook-triggered rebuild on feed change (best SEO),
 *   (c) pre-render mirrored jobs and deep-link out to apply.
 * Both decisions are the client's call — do not pick silently.
 *
 * Until then, getJobs() returns the typed mock, and /careers/[slug] pages are
 * statically generated from it (which forecloses none of the options above).
 * Swapping in a live source means implementing fetchLiveJobs() and choosing a
 * rendering strategy; every consumer goes through this module.
 * ============================================================================
 */
export async function getJobs(): Promise<Job[]> {
  const endpoint = process.env.CAREERS_JOBS_API_URL?.trim();
  if (!endpoint) return mockJobs;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return mockJobs;
    const body = (await response.json()) as { jobs?: Job[] };
    return Array.isArray(body.jobs) ? body.jobs : mockJobs;
  } catch {
    return mockJobs;
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
