/*
 * Page-copy shapes + the ContentBundle — the single payload the dashboard
 * publishes and satco-web reads (dashboard kickoff §2.2 / §7).
 *
 * Every field mirrors an export currently living in satco-web/content/*.ts, so
 * the generated JSON reproduces the site's content model exactly. Jobs are
 * deliberately NOT here — they are runtime data handled by the JobStore seam
 * (plan §6), keeping the static content bundle unchanged from today's build.
 */

import type {
  Certification,
  Classification,
  Client,
  FooterColumn,
  ImageRef,
  LeadershipMember,
  License,
  NavItem,
  Sector,
  SiteContent,
  Stat,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Per-page copy objects (verbatim-copy discipline — plain strings)           */
/* -------------------------------------------------------------------------- */

export interface HomeContent {
  hero: { eyebrow: string; headline: string; explore: string; regionLabel: string };
  statBand: { eyebrow: string; heading: string };
  whoWeAre: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: string;
    imageCard: { value: string; label: string };
  };
  careersTeaser: { eyebrow: string; heading: string; body: string; cta: string };
  contactTeaser: { heading: string; cta: string };
}

export interface CompanyContent {
  title: string;
  paragraphs: string[];
  eyebrow: string;
  heading: string;
  facts: { value: string; label: string }[];
  image: ImageRef;
  sectorsLinkHeading: string;
}

export interface CertificationsPageCopy {
  intro: string[];
  classificationsHeading: string;
  classificationsLead: string;
  licensesHeading: string;
  isoHeading: string;
  isoLead: string;
  leedLead: string;
  ongoingHeading: string;
  ongoing: string;
}

export interface ClientsPageCopy {
  title: string;
  subline: string;
  selectedHeading: string;
  selectedSub: string;
  directoryHeading: string;
  searchLabel: string;
  emptyMessage: string;
  /** Verbatim legal line (docx comment #31) — must not be auto-"improved" */
  disclaimer: string;
}

export interface LeadershipPageCopy {
  title: string;
  subline: string;
  pendingNote: string;
  placeholderCount: number;
}

export type InquiryType =
  | "partnerships"
  | "opportunities"
  | "procurement"
  | "careers"
  | "general";

export interface ContactInquiryOption {
  value: InquiryType;
  label: string;
  /** Human-readable routed department(s) — comment #22 proposal */
  routesTo: string;
}

export interface ContactPageCopy {
  title: string;
  subline: string;
  form: {
    heading: string;
    requiredNote: string;
    successMessage: string;
    nameLabel: string;
    nameError: string;
    emailLabel: string;
    emailError: string;
    orgLabel: string;
    inquiryLabel: string;
    routePrefix: string;
    proposalNote: string;
    messageLabel: string;
    messageError: string;
    submitLabel: string;
  };
  inquiryOptions: ContactInquiryOption[];
  details: {
    heading: string;
    officeLabel: string;
    phoneLabel: string;
    phone: string;
    emailLabel: string;
    hoursLabel: string;
    hours: string;
  };
  mapLabel: string;
  mapCaption: string;
}

export interface CareersPageCopy {
  title: string;
  intro: string[];
  life: { eyebrow: string; heading: string; paragraphs: string[] };
  roles: { heading: string; note: string; emptyMessage: string; emptyLinkLabel: string };
  howWeHire: {
    heading: string;
    paragraphs: string[];
    steps: { title: string; body: string }[];
  };
  generalApplication: { heading: string; body: string; cta: string };
  detail: {
    summaryHeading: string;
    responsibilitiesHeading: string;
    requirementsHeading: string;
    locationHeading: string;
    applyLabel: string;
    applyNote: string;
    backLabel: string;
  };
  filters: {
    legend: string;
    keyword: string;
    keywordPlaceholder: string;
    location: string;
    sector: string;
    discipline: string;
    level: string;
  };
}

export interface NavigationContent {
  primaryNav: NavItem[];
  footerColumns: FooterColumn[];
  footerContactColumn: FooterColumn;
}

export interface SectorsIntroContent {
  heading: string;
  subhead: string;
}

export interface PendingExperienceCard {
  heading: string;
  body: string;
  linkLabel: string;
}

/* -------------------------------------------------------------------------- */
/* Feature flags — dashboard kickoff §6, plan §8                              */
/* Build-time flags baked into the content bundle; seeds are the LOCKED values.*/
/* -------------------------------------------------------------------------- */

export type CareersSource = "dashboard" | "linkedin" | "ats";

export interface SectionVisibility {
  /** Homepage stat band */
  statBand: boolean;
  /** Homepage "Who we are" block */
  whoWeAre: boolean;
  /** Homepage careers teaser */
  careersTeaser: boolean;
  /** Homepage contact teaser */
  contactTeaser: boolean;
}

export interface FeatureFlags {
  /** Loading-screen total time in ms. Seed 1200; hard cap 1500 (docx comment #2). */
  loading_duration_ms: number;
  /** Review-only timing switcher for the loading screen. Seed off. */
  show_review_control: boolean;
  /** Activates the reserved /vendors nav slot. Seed off (docx comment #4). */
  show_vendor_tab: boolean;
  /** Publishes draft "Selected Experience" copy for Construction/Operations/PPP (plan §12 Q4). Seed off. */
  show_pending_experience: boolean;
  /** Per-section homepage visibility. */
  section_visibility: SectionVisibility;
  /** Where jobs come from (plan §9). Seed dashboard. */
  careers_source: CareersSource;
  /** Optional sitewide notice; null = hidden. */
  maintenance_banner: string | null;
}

/** LOCKED seed values (dashboard kickoff §6). The loading cap is enforced elsewhere. */
export const DEFAULT_FLAGS: FeatureFlags = {
  loading_duration_ms: 1200,
  show_review_control: false,
  show_vendor_tab: false,
  show_pending_experience: false,
  section_visibility: {
    statBand: true,
    whoWeAre: true,
    careersTeaser: true,
    contactTeaser: true,
  },
  careers_source: "dashboard",
  maintenance_banner: null,
};

/** Hard cap on the loading duration picker (docx comment #2: 1.5s absolute max). */
export const LOADING_DURATION_MAX_MS = 1500;
/** Locked loading text — frozen by client sign-off (docx comment #2). */
export const LOADING_TEXT_LOCKED = "Celebrating over 50 years of excellence";

/* -------------------------------------------------------------------------- */
/* The bundle                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Everything the static site renders from, in one typed payload. The dashboard's
 * PublishService writes this as satco-web/content/generated/content.json and the
 * site's content/*.ts loaders read slices of it. Later this is produced by a
 * build-time Supabase fetch instead — same shape, no site changes (plan §6).
 */
export interface ContentBundle {
  site: SiteContent;
  navigation: NavigationContent;
  home: HomeContent;
  statPendingNote: string;
  stats: Stat[];
  sectorsIntro: SectorsIntroContent;
  showPendingExperience: boolean;
  pendingExperienceCard: PendingExperienceCard;
  sectors: Sector[];
  company: CompanyContent;
  certificationsPage: CertificationsPageCopy;
  classifications: Classification[];
  licenses: License[];
  certifications: Certification[];
  clientsPage: ClientsPageCopy;
  clients: Client[];
  leadershipPage: LeadershipPageCopy;
  leadership: LeadershipMember[];
  careersPage: CareersPageCopy;
  contactPage: ContactPageCopy;
  flags: FeatureFlags;
}
