/*
 * Dashboard system-of-record types: jobs, applications, contact inquiries,
 * private media (CVs), staff accounts and the audit log. Mirrored 1:1 by the
 * Neon schema (satco-admin/db/schema.sql) and the local JSON stores, so the
 * site's public forms and the dashboard agree on one model.
 *
 * Page copy is NOT managed here any more: the sites' content/generated/*.json
 * files are edited in code (see CLAUDE.md "Content is data").
 */

import type { Job, SectorSlug } from "./types";
import type { InquiryType } from "./content";

/* ------------------------------- Roles & page access --------------------- */

/**
 * Two roles. `admin` can do everything (every page, Users & access, audit log,
 * destructive actions). `staff` can open exactly the pages granted on their
 * account (`UserAccount.access`): the Jobs & applications page and/or any of the
 * five inquiry inboxes.
 */
export type Role = "staff" | "admin";

export const ROLES: Role[] = ["staff", "admin"];

/** Every inquiry inbox, in the order the contact form lists them. */
export const INQUIRY_TYPES: InquiryType[] = [
  "partnerships",
  "opportunities",
  "procurement",
  "careers",
  "general",
];

/** A page a staff account can be granted: Jobs & applications, or one inbox. */
export type AccessPage = "jobs" | InquiryType;

/** All grantable pages, in display order. */
export const ACCESS_PAGES: AccessPage[] = ["jobs", ...INQUIRY_TYPES];

/** Capabilities checked by server actions and routes. Named RoleCapability to
 *  avoid colliding with the sector-content `Capability` type in ./types. */
export type RoleCapability =
  | "view" // sign in and see the overview
  | "manageJobs" // create/edit/publish/close jobs, triage applications (page "jobs")
  | "downloadCv" // private CV files (page "jobs")
  | "admin"; // users, roles, audit, destructive actions, every page

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  /** Pages this user may open. Admins see every page regardless. */
  access: AccessPage[];
  active: boolean;
  createdAt: string;
}

type Grantee = Pick<UserAccount, "role" | "access">;

/** Per-page access control. */
export function canAccessPage(user: Grantee, page: AccessPage): boolean {
  return user.role === "admin" || user.access.includes(page);
}

export function canAccessInbox(user: Grantee, inbox: InquiryType): boolean {
  return canAccessPage(user, inbox);
}

/** The inboxes a user may open, in canonical order. */
export function accessibleInboxes(user: Grantee): InquiryType[] {
  return INQUIRY_TYPES.filter((inbox) => canAccessPage(user, inbox));
}

/** Capability check derived from role + page grants. */
export function userCan(user: Grantee, cap: RoleCapability): boolean {
  switch (cap) {
    case "view":
      return true;
    case "admin":
      return user.role === "admin";
    case "manageJobs":
    case "downloadCv":
      return canAccessPage(user, "jobs");
  }
}

/* ------------------------------- Jobs ------------------------------------ */

export type JobState = "draft" | "published" | "paused" | "closed" | "archived";

/** A job as stored in the dashboard: the site's Job shape + lifecycle metadata. */
export interface JobRecord extends Job {
  state: JobState;
  hiringManager?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------- Applications ---------------------------- */

export type ApplicationStatus =
  | "new"
  | "under-review"
  | "shortlisted"
  | "interview"
  | "final-review"
  | "offer"
  | "hired"
  | "rejected"
  | "withdrawn"
  | "talent-pool";

export type CriteriaMatch =
  | "meets-required"
  | "needs-review"
  | "missing-required";

export interface ScreeningAnswer {
  questionId: string;
  question: string;
  criteria: "required" | "preferred";
  answer: string;
  meetsCriteria?: boolean;
}

export interface ApplicationNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface ApplicationHistoryItem {
  id: string;
  label: string;
  detail?: string;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  candidateId?: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone?: string;
  currentCity?: string;
  countryOfResidence?: string;
  currentJobTitle?: string;
  yearsExperience?: number;
  qualification?: string;
  specialization?: string;
  currentEmployer?: string;
  linkedinUrl?: string;
  noticePeriod?: string;
  workAuthorization?: string;
  skills?: string[];
  applicationSource?: string;
  /** Private-bucket media id (CV) — signed-URL access for publisher/admin only. */
  cvMediaId?: string;
  coverNote?: string;
  screeningAnswers?: ScreeningAnswer[];
  criteriaMatch?: CriteriaMatch;
  internalNotes?: ApplicationNote[];
  history?: ApplicationHistoryItem[];
  status: ApplicationStatus;
  createdAt: string;
  updatedAt?: string;
}

export type GeneralApplicationStatus = "new" | "reviewing" | "archived";

export interface GeneralApplication {
  id: string;
  applicantName: string;
  email: string;
  phone?: string;
  discipline?: string;
  sector?: SectorSlug;
  cvMediaId?: string;
  note?: string;
  status: GeneralApplicationStatus;
  createdAt: string;
}

/* ------------------------------- Contact --------------------------------- */

export type SubmissionStatus = "new" | "in-progress" | "responded" | "closed";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  organization?: string;
  inquiryType: InquiryType;
  message: string;
  /** Routed department(s), derived from inquiryType (comment #22). */
  assignedDept: string;
  status: SubmissionStatus;
  /** Staff member handling it (email), if assigned. */
  assignee?: string;
  internalNote?: string;
  createdAt: string;
  updatedAt?: string;
}

/* ------------------------------- Media ----------------------------------- */

export type MediaBucket = "public-media" | "private-uploads";

export interface MediaItem {
  id: string;
  /** Public URL or store-relative path. */
  path: string;
  filename: string;
  /** REQUIRED alt text (a11y) — enforced on upload. Empty only for decorative. */
  alt: string;
  bucket: MediaBucket;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  /** Tag used to preview client logos in grayscale, etc. */
  category?: "logo" | "certificate" | "photo" | "cv" | "other";
  uploadedAt: string;
  uploadedBy: string;
}

/* ------------------------------- Audit ----------------------------------- */

export interface AuditEntry {
  id: string;
  ts: string;
  /** Actor email/name. */
  actor: string;
  /** e.g. "content.update", "publish", "job.create", "submission.assign". */
  action: string;
  /** e.g. "sector", "job", "submission", "flags". */
  entity: string;
  entityId?: string;
  /** Human-readable one-line summary. */
  summary: string;
  /** Optional structured before/after diff. */
  diff?: unknown;
}
