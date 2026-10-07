/*
 * Adapter interfaces — the seams every hosted service sits behind.
 * Two implementations ship: local (JSON files under data/) and Neon (Postgres),
 * selected by DATA_BACKEND in ./index.ts. Nothing in the UI imports a concrete
 * store directly, so swapping the backend is a drop-in, not a rewrite.
 *
 * Scope (2026-10-07): the dashboard manages runtime data only — jobs and
 * applications (Careers), contact inquiries (one inbox per inquiry type) and
 * staff accounts. Page copy lives in the sites' content/*.json and is edited in
 * code, so there is no content store or publish service any more.
 */

import type {
  AccessPage,
  AuditEntry,
  InquiryType,
  ContactSubmission,
  GeneralApplication,
  JobApplication,
  JobRecord,
  JobState,
  MediaBucket,
  MediaItem,
  Role,
  UserAccount,
} from "@satco/shared";

/* --------------------------------- Auth ---------------------------------- */

/** The signed-in user as seen by every screen. Re-read from the user store on
 *  each request, so role / inbox changes apply immediately. */
export interface Session {
  userId: string;
  name: string;
  email: string;
  role: Role;
  /** Pages this user may open (admins: every page). */
  access: AccessPage[];
}

/* ------------------------------- UserStore ------------------------------- */

export interface UserStore {
  /** Staff directory. */
  list(): Promise<UserAccount[]>;
  /** Account by email (case-insensitive), active or not, or undefined. */
  getByEmail(email: string): Promise<UserAccount | undefined>;
  getById(id: string): Promise<UserAccount | undefined>;
  /** Create a staff account (admin). Sign-in is by Google account with this email. */
  create(input: {
    name: string;
    email: string;
    role: Role;
    access: AccessPage[];
  }): Promise<UserAccount>;
  /** Change a user's name, role, page access or active state (admin). */
  update(
    id: string,
    patch: Partial<Pick<UserAccount, "name" | "role" | "access" | "active">>,
  ): Promise<UserAccount>;
}

/* ------------------------------ MediaStore ------------------------------- */
// Kept for the private CV bucket only (applications attach a CV).

export interface NewMedia {
  filename: string;
  alt: string;
  bucket: MediaBucket;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  category?: MediaItem["category"];
  /** Base64 (data URL body) of the file bytes, for the local disk write. */
  dataBase64?: string;
}

export interface MediaStore {
  list(bucket?: MediaBucket): Promise<MediaItem[]>;
  get(id: string): Promise<MediaItem | undefined>;
  add(item: NewMedia, uploadedBy: string): Promise<MediaItem>;
  updateAlt(id: string, alt: string): Promise<MediaItem>;
  remove(id: string): Promise<void>;
}

/* -------------------------------- JobStore ------------------------------- */

export type JobInput = Omit<JobRecord, "createdAt" | "updatedAt">;

export interface JobStore {
  list(): Promise<JobRecord[]>;
  get(slug: string): Promise<JobRecord | undefined>;
  create(job: JobInput): Promise<JobRecord>;
  update(id: string, patch: Partial<JobInput>): Promise<JobRecord>;
  setState(id: string, state: JobState): Promise<JobRecord>;
  remove(id: string): Promise<void>;
}

/* ----------------------------- SubmissionStore --------------------------- */

export type NewJobApplication = Omit<
  JobApplication,
  "id" | "status" | "createdAt"
>;

/** What the public contact form provides; the store adds id, status, routing. */
export type NewContactSubmission = Pick<
  ContactSubmission,
  "name" | "email" | "organization" | "inquiryType" | "message"
>;

export interface SubmissionStore {
  /** Newest first. `inbox` narrows to one inquiry type. */
  listContact(inbox?: InquiryType): Promise<ContactSubmission[]>;
  getContact(id: string): Promise<ContactSubmission | undefined>;
  /** Insert from the public contact endpoint. */
  createContact(input: NewContactSubmission): Promise<ContactSubmission>;
  updateContact(
    id: string,
    patch: Partial<Pick<ContactSubmission, "status" | "assignee" | "internalNote">>,
  ): Promise<ContactSubmission>;
  listApplications(): Promise<JobApplication[]>;
  createApplication(input: NewJobApplication): Promise<JobApplication>;
  updateApplication(
    id: string,
    patch: Partial<
      Pick<JobApplication, "status" | "internalNotes" | "history" | "criteriaMatch">
    >,
  ): Promise<JobApplication>;
  listGeneralApplications(): Promise<GeneralApplication[]>;
  updateGeneralApplication(
    id: string,
    patch: Partial<Pick<GeneralApplication, "status">>,
  ): Promise<GeneralApplication>;
}

/* -------------------------------- AuditLog ------------------------------- */

export interface AuditLog {
  append(entry: Omit<AuditEntry, "id" | "ts">): Promise<AuditEntry>;
  list(limit?: number): Promise<AuditEntry[]>;
}

/* ------------------------------- The bundle ------------------------------ */

export interface Adapters {
  users: UserStore;
  media: MediaStore;
  jobs: JobStore;
  submissions: SubmissionStore;
  audit: AuditLog;
}
