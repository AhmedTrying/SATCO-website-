/*
 * Shared content-model interfaces — approved Phase 0 plan §5.
 *
 * CANONICAL LOCATION. Moved here from satco-web/lib/types.ts so the site, the
 * dashboard, and (later) the Supabase-generated DB types all agree on one set of
 * shapes (dashboard kickoff §2.1). satco-web/lib/types.ts is now a thin re-export
 * of this module, so its `@/lib/types` import sites are unchanged.
 *
 * All page copy lives in typed content files importing these shapes; words are
 * never hard-coded in JSX.
 */

export type SectorSlug = "airports" | "construction" | "operations" | "ppp";

export interface CTALink {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
}

export interface ImageRef {
  src: string;
  /** REQUIRED — a11y policy (empty string only for decorative images) */
  alt: string;
  width?: number;
  height?: number;
  credit?: string;
}

export interface Capability {
  id: string;
  title: string;
  /** Verbatim approved copy */
  body: string;
}

export interface DeliveryModel {
  models: string[];
  /** Section heading shown beside the copy (display microcopy from the design) */
  heading: string;
  /** Verbatim docx copy; "\n\n" separates paragraphs */
  description: string;
  /** Extra verbatim block rendered after the description (e.g. PPP "Integrated Platform Advantage") */
  secondary?: { title: string; body: string };
}

export interface SelectedExperience {
  /** Construction / Operations / PPP are pending a client go/no-go (plan §12 Q4) */
  status: "confirmed" | "pending-decision";
  body: string;
  projectsLink?: CTALink;
}

export interface Sector {
  slug: SectorSlug;
  name: string;
  shortName: string;
  tagline: string;
  overviewShort: string;
  /** L2 overview, verbatim docx; "\n\n" separates paragraphs */
  overview: string;
  capabilities: Capability[];
  /** PPP has a single prose capabilities block instead of titled cards */
  capabilitiesProse?: string;
  delivery: DeliveryModel;
  experience: SelectedExperience;
  /** Display heading for the experience section (design microcopy) */
  experienceHeading?: string;
  whySatco: string;
  /** Sector name as it appears in the "Why SATCO in …" heading (case-sensitive: "PPP") */
  whyLabel: string;
  /** Condensed one-screen copy surfaced on small viewports (docx "LM" sections) */
  mobileSummary: string;
  /** Mobile L1 CTA label, verbatim per-sector from the docx "LM" sections */
  mobileCta: string;
  hero: ImageRef;
  /** CSS object-position for the hero crop (from the design) */
  heroPosition?: string;
  card: ImageRef;
  gallery?: ImageRef[];
  /** CTA label for the closing contact link (design microcopy) */
  contactCta: string;
  order: number;
}

export interface Stat {
  id: string;
  label: string;
  /** null when the figure is still being collected — NEVER invent one (stat #3) */
  value: number | null;
  display: string;
  /** Animated suffix appended to the number ("K+", "M+") */
  suffix?: string;
  /** Unit shown after the label ("Persons", "sqm", "Buildings") */
  unit?: string;
  decimals?: number;
  countUp?: boolean;
}

export interface Classification {
  category: string;
  activities: string[];
}

export interface License {
  name: string;
  scope: string;
}

export interface Certification {
  code: string;
  title: string;
  group: "iso" | "leed" | "other";
  note?: string;
  /** Certificate scan/badge — client wants these shown on the site (docx comment #28) */
  image?: ImageRef;
}

/** The Clients page has TWO populations (docx comment #31): logo grid vs A–Z directory. */
export interface Client {
  id: string;
  name: string;
  tier: "selected" | "directory";
  /** Required when tier === 'selected'; rendered GRAYSCALE, normalized height, NEVER linked */
  logo?: ImageRef;
  sector?: SectorSlug[];
  geography?: string;
}

/** Every job needs a detail page (docx comment #42); no PDFs, no email-only workflows. */
export interface Job {
  id: string;
  slug: string;
  title: string;
  location: string;
  sector: SectorSlug;
  discipline: string;
  experienceLevel: "entry" | "mid" | "senior" | "lead" | "executive";
  type?: "full-time" | "contract";
  postedAt?: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  /** Live ATS/LinkedIn apply URL — never a PDF or mailto */
  applyHref: string;
  source: "mock" | "linkedin" | "ats";
}

export interface LeadershipMember {
  id: string;
  name: string;
  title: string;
  bio?: string;
  photo?: ImageRef;
  order: number;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  /** Wider dropdown panel (the design gives Operating sectors 340px vs 300px) */
  wide?: boolean;
}

export interface FooterColumn {
  title: string;
  links: CTALink[];
}

export interface SiteContent {
  name: string;
  legalName: string;
  established: number;
  location: string;
  /** Frozen by client sign-off (docx comment #2) — do not edit */
  loadingText: string;
  description: string;
  copyrightHolder: string;
  establishedLine: string;
  contact: {
    addressLines: string[];
    email: string;
  };
  flags: {
    showVendorsTab: boolean;
  };
}
