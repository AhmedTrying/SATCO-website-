import type { Job } from "@/lib/types";
import generatedJobs from "@/content/generated/jobs.json";

/**
 * Published roles are synchronized by the Careers dashboard. This committed
 * snapshot keeps offline builds reliable. Production prebuild refreshes it from
 * the dashboard's public jobs feed, with Neon as a fallback, before static pages
 * are generated.
 */
export const jobs = generatedJobs as unknown as Job[];
