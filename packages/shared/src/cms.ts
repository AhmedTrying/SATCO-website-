/*
 * CMS-infrastructure shapes — the dashboard's system-of-record types.
 * These mirror the Supabase data model (plan §3) so that swapping the local
 * adapters for Supabase later is a drop-in: same shapes, real backend.
 *
 * Jobs, applications, submissions, media, users and audit entries are shared so
 * the site (runtime reads/inserts, later) and the dashboard agree on one model.
 */

import type { Job, SectorSlug } from "./types";
import type { InquiryType } from "./content";

/* ------------------------------- Roles ----------------------------------- */

/** Permission tiers (plan §4). Ordered least → most privileged. */
export type Role = "viewer" | "editor" | "publisher" | "admin";

export const ROLES: Role[] = ["viewer", "editor", "publisher", "admin"];

/** Capabilities gated by role (plan §4 matrix). Named RoleCapability to avoid
 *  colliding with the sector-content `Capability` type in ./types. */
export type RoleCapability =
  | "view" // see dashboard & drafts
  | "edit" // create/edit drafts, upload media
  | "publish" // publish + trigger rebuild
  | "manageJobs" // open/close jobs, triage submissions
  | "downloadCv" // private bucket
  | "admin"; // users, roles, settings, flags, destructive

/** Which capabilities each role holds. */
export const ROLE_CAPABILITIES: Record<Role, RoleCapability[]> = {
  viewer: ["view"],
  editor: ["view", "edit"],
  publisher: ["view", "edit", "publish", "manageJobs", "downloadCv"],
  admin: ["view", "edit", "publish", "manageJobs", "downloadCv", "admin"],
};

export function roleCan(role: Role, cap: RoleCapability): boolean {
  return ROLE_CAPABILITIES[role].includes(cap);
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  createdAt: string;
}

/* ------------------------------- Content status -------------------------- */

export type ContentStatus = "draft" | "published";

/* ------------------------------- Jobs ------------------------------------ */

export type JobState = "draft" | "open" | "closed";

/** A job as stored in the dashboard: the site's Job shape + lifecycle metadata. */
export interface JobRecord extends Job {
  state: JobState;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------- Applications ---------------------------- */

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "hired";

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone?: string;
  /** Private-bucket media id (CV) — signed-URL access for publisher/admin only. */
  cvMediaId?: string;
  coverNote?: string;
  status: ApplicationStatus;
  createdAt: string;
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

export type SubmissionStatus = "new" | "in-progress" | "handled" | "archived";

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
  createdAt: string;
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

/* ------------------------------- Publish --------------------------------- */

export interface PublishRecord {
  id: string;
  publishedAt: string;
  publishedBy: string;
  summary: string;
  /** Field paths that changed since the previous publish. */
  changedKeys: string[];
}
