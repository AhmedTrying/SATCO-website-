/*
 * Adapter interfaces — the seams every hosted service sits behind
 * (dashboard kickoff §3). One local implementation ships now; a documented
 * // TODO(supabase) implementation lands later. Selection is by env
 * (DATA_BACKEND=local now → supabase later) in ./index.ts.
 *
 * Nothing in the UI imports a concrete store directly — everything goes through
 * these interfaces, so swapping the backend is a drop-in, not a rewrite.
 */

import type {
  AuditEntry,
  ContactSubmission,
  ContentBundle,
  GeneralApplication,
  JobApplication,
  JobRecord,
  JobState,
  MediaBucket,
  MediaItem,
  PublishRecord,
  Role,
  UserAccount,
} from "@satco/shared";

/* --------------------------------- Auth ---------------------------------- */

export interface Session {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthProvider {
  /** Current session from the request (cookie now, Supabase Auth later), or null. */
  getSession(): Promise<Session | null>;
  /** Mock dev login: resolve a seeded staff account by email. Must run in a server action. */
  signIn(email: string): Promise<Session>;
  /** Clear the session. Must run in a server action. */
  signOut(): Promise<void>;
  /** Role switcher (mock only) — preview permissions without new accounts. Server action. */
  setRole(role: Role): Promise<Session>;
  /** Staff directory. */
  listUsers(): Promise<UserAccount[]>;
  /** Invite/create a staff account (admin). Supabase: an invite flow. */
  createUser(input: { name: string; email: string; role: Role }): Promise<UserAccount>;
  /** Change a user's role or active state (admin). */
  updateUser(
    id: string,
    patch: Partial<Pick<UserAccount, "role" | "active">>,
  ): Promise<UserAccount>;
}

/* ------------------------------ ContentStore ----------------------------- */

export interface ContentStore {
  /** The working draft (editable). Seeded from satco-web/content on first read. */
  getDraft(): Promise<ContentBundle>;
  /** Persist the full draft bundle. */
  saveDraft(bundle: ContentBundle): Promise<void>;
  /** The last published snapshot (what the live site currently reflects). */
  getPublished(): Promise<ContentBundle>;
}

/* ------------------------------ MediaStore ------------------------------- */

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
  /** Alt text is REQUIRED for public media (a11y) — enforced here. */
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

export interface SubmissionStore {
  listContact(): Promise<ContactSubmission[]>;
  updateContact(
    id: string,
    patch: Partial<Pick<ContactSubmission, "status" | "assignee">>,
  ): Promise<ContactSubmission>;
  listApplications(): Promise<JobApplication[]>;
  updateApplication(
    id: string,
    patch: Partial<Pick<JobApplication, "status">>,
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

/* ----------------------------- PublishService ---------------------------- */

export interface PublishDiffEntry {
  /** Top-level ContentBundle key, e.g. "sectors", "flags". */
  key: string;
  label: string;
  changed: boolean;
}

export interface PublishService {
  /** Field-level diff of draft vs last published. */
  diff(): Promise<PublishDiffEntry[]>;
  /**
   * Publish: snapshot draft → published, write the site's generated JSON, record
   * an audit entry. Rebuild is manual (`npm run build` in satco-web) for now;
   * later this flips status + fires a debounced deploy hook. (kickoff §3)
   */
  publish(actor: string): Promise<PublishRecord>;
  history(limit?: number): Promise<PublishRecord[]>;
}

/* ------------------------------- The bundle ------------------------------ */

export interface Adapters {
  auth: AuthProvider;
  content: ContentStore;
  media: MediaStore;
  jobs: JobStore;
  submissions: SubmissionStore;
  audit: AuditLog;
  publish: PublishService;
}
