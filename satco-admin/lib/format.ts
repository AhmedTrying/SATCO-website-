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
  handled: "badge-green",
  archived: "badge-stone",
  // applications
  reviewing: "badge-stone",
  shortlisted: "badge-green",
  rejected: "badge-red",
  hired: "badge-green",
  // jobs
  open: "badge-green",
  closed: "badge-red",
  draft: "badge-amber",
};

export function statusBadgeClass(status: string): string {
  return `badge ${BADGE[status] ?? "badge-stone"}`;
}

export function titleCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
