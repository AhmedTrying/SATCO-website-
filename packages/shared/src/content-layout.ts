/*
 * The per-section file layout for the site's generated content
 * (satco-web/content/generated/*.json) — the SINGLE SOURCE OF TRUTH shared by:
 *   - the dashboard's Publish (satco-admin writes these files / Neon rows), and
 *   - the site build's Neon fetch (satco-web/scripts/fetch-content.mts).
 * Both must produce the identical file set, so the mapping lives here in @satco/shared.
 * Each key is a filename; each value is the slice the matching satco-web/content/*.ts
 * loader re-exports (so the site tree-shakes per page — no whole-bundle bloat).
 * Mirror this if you add content sections.
 */

import type { ContentBundle } from "./content";

export function splitBundle(b: ContentBundle): Record<string, unknown> {
  return {
    "site.json": b.site,
    "home.json": b.home,
    "stats.json": { statPendingNote: b.statPendingNote, stats: b.stats },
    "navigation.json": b.navigation,
    "company.json": b.company,
    "certifications.json": {
      certificationsPage: b.certificationsPage,
      classifications: b.classifications,
      licenses: b.licenses,
      certifications: b.certifications,
    },
    "clients.json": { clientsPage: b.clientsPage, clients: b.clients },
    "leadership.json": { leadershipPage: b.leadershipPage, leadership: b.leadership },
    "contact.json": b.contactPage,
    "careers.json": b.careersPage,
    "sectors.json": {
      showPendingExperience: b.showPendingExperience,
      pendingExperienceCard: b.pendingExperienceCard,
      sectors: b.sectors,
      sectorsIntro: b.sectorsIntro,
    },
    "flags.json": b.flags,
  };
}
