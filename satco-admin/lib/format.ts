/** Presentation helpers shared across screens (pure — safe on server or client). */

export function formatDate(iso: string): string {
  // Deterministic, locale-stable formatting (avoids hydration drift).
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const BADGE: Record<string, string> = {
  // contact submission
  new: "badge-amber",
  "in-progress": "badge-stone",
  responded: "badge-green",
  closed: "badge-red",
  // applications
  "under-review": "badge-stone",
  shortlisted: "badge-green",
  interview: "badge-amber",
  "final-review": "badge-amber",
  offer: "badge-green",
  rejected: "badge-red",
  hired: "badge-green",
  withdrawn: "badge-stone",
  "talent-pool": "badge-stone",
  // jobs
  published: "badge-green",
  paused: "badge-amber",
  draft: "badge-amber",
  archived: "badge-stone",
};

export function statusBadgeClass(status: string): string {
  return `badge ${BADGE[status] ?? "badge-stone"}`;
}

export function titleCase(s: string): string {
  return s
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
