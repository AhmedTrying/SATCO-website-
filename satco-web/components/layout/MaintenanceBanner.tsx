import { flags } from "@/content/flags";

/*
 * Optional sitewide notice controlled by the maintenance_banner flag.
 * Renders nothing when the flag is null (default) — no DOM, no layout change.
 */
export function MaintenanceBanner() {
  const message = flags.maintenance_banner;
  if (!message) return null;
  return (
    <div
      role="status"
      className="bg-bronze-800 px-4 py-2 text-center text-sm text-stone-50"
    >
      {message}
    </div>
  );
}
