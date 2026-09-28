import type { Job } from "./types";

/** A deadline stays open through its calendar date in Saudi Arabia (UTC+03). */
export function isJobDeadlineOpen(
  deadline: Job["applicationDeadline"],
  now = new Date(),
): boolean {
  if (!deadline) return true;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;
  const deadlineDay = date.toISOString().slice(0, 10);
  const todayInRiyadh = new Date(now.getTime() + 3 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return deadlineDay >= todayInRiyadh;
}
