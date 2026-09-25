import type { Job } from "@/lib/types";
import generatedJobs from "@/content/generated/jobs.json";

/**
 * Published roles are synchronized by the Careers dashboard. This committed
 * snapshot keeps the static site build reliable when its live admin API is not
 * available, while the build can refresh from that API when configured.
 */
export const jobs = generatedJobs as unknown as Job[];
