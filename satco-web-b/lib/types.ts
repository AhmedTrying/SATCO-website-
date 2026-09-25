/*
 * Content-model interfaces now live in the shared workspace package
 * (@satco/shared) so the site, the dashboard, and the future Supabase schema all
 * agree on one set of shapes (dashboard kickoff §2.1).
 *
 * This file is a thin re-export kept in place so every existing `@/lib/types`
 * import site in satco-web is unchanged — the move is reversible and invisible
 * to components.
 */
export type {
  SectorSlug,
  CTALink,
  ImageRef,
  Capability,
  DeliveryModel,
  SelectedExperience,
  Sector,
  Stat,
  Classification,
  License,
  Certification,
  Client,
  Job,
  LeadershipMember,
  NavItem,
  FooterColumn,
  SiteContent,
} from "@satco/shared";
