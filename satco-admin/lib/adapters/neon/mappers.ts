/*
 * Row → model mappers for the Neon backend. Postgres returns snake_case columns,
 * timestamptz as a JS Date, bigint as a string, and NULL as null. Each mapper turns
 * a DB row into the exact @satco/shared shape the dashboard already consumes:
 * camelCase keys, ISO-string timestamps, numeric bigints, and optional fields as
 * `undefined` (never `null`) so the objects match the JSON the local backend produced.
 */

import type {
  AuditEntry,
  ContactSubmission,
  GeneralApplication,
  JobApplication,
  JobRecord,
  MediaItem,
  PublishRecord,
  Role,
  UserAccount,
} from "@satco/shared";

type Timestamp = string | Date;

const iso = (v: Timestamp): string => (v instanceof Date ? v.toISOString() : String(v));
const isoOpt = (v: Timestamp | null): string | undefined => (v == null ? undefined : iso(v));
const opt = <T>(v: T | null | undefined): T | undefined => (v == null ? undefined : v);

/* -------------------------------- users ---------------------------------- */

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  created_at: Timestamp;
}

export const toUser = (r: UserRow): UserAccount => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
  active: r.active,
  createdAt: iso(r.created_at),
});

/* --------------------------------- jobs ---------------------------------- */

export interface JobRow {
  id: string;
  slug: string;
  job_reference: string | null;
  title: string;
  department: string | null;
  location: string;
  sector: JobRecord["sector"];
  discipline: string;
  experience_level: JobRecord["experienceLevel"];
  type: JobRecord["type"] | null;
  number_of_vacancies: number | null;
  experience_required: string | null;
  education: string | null;
  posted_at: Timestamp | null;
  application_deadline: Timestamp | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  preferred_qualifications: string[] | null;
  screening_questions: NonNullable<JobRecord["screeningQuestions"]> | null;
  hiring_manager: string | null;
  apply_href: string;
  source: JobRecord["source"];
  state: JobRecord["state"];
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const toJob = (r: JobRow): JobRecord => ({
  id: r.id,
  slug: r.slug,
  jobReference: opt(r.job_reference),
  title: r.title,
  department: opt(r.department),
  location: r.location,
  sector: r.sector,
  discipline: r.discipline,
  experienceLevel: r.experience_level,
  type: opt(r.type),
  numberOfVacancies: opt(r.number_of_vacancies),
  experienceRequired: opt(r.experience_required),
  education: opt(r.education),
  postedAt: isoOpt(r.posted_at),
  applicationDeadline: isoOpt(r.application_deadline),
  summary: r.summary,
  responsibilities: r.responsibilities ?? [],
  requirements: r.requirements ?? [],
  preferredQualifications: r.preferred_qualifications ?? [],
  screeningQuestions: r.screening_questions ?? [],
  hiringManager: opt(r.hiring_manager),
  applyHref: r.apply_href,
  source: r.source,
  state: r.state,
  createdAt: iso(r.created_at),
  updatedAt: iso(r.updated_at),
});

/* --------------------------- contact submissions ------------------------- */

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  organization: string | null;
  inquiry_type: ContactSubmission["inquiryType"];
  message: string;
  assigned_dept: string;
  status: ContactSubmission["status"];
  assignee: string | null;
  internal_note: string | null;
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export const toContact = (r: ContactRow): ContactSubmission => ({
  id: r.id,
  name: r.name,
  email: r.email,
  organization: opt(r.organization),
  inquiryType: r.inquiry_type,
  message: r.message,
  assignedDept: r.assigned_dept,
  status: r.status,
  assignee: opt(r.assignee),
  internalNote: opt(r.internal_note),
  createdAt: iso(r.created_at),
  updatedAt: r.updated_at ? iso(r.updated_at) : undefined,
});

/* ---------------------------- job applications --------------------------- */

export interface JobApplicationRow {
  id: string;
  candidate_id: string | null;
  job_id: string;
  job_title: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  current_city: string | null;
  country_of_residence: string | null;
  current_job_title: string | null;
  years_experience: number | null;
  qualification: string | null;
  specialization: string | null;
  current_employer: string | null;
  linkedin_url: string | null;
  notice_period: string | null;
  work_authorization: string | null;
  skills: string[] | null;
  application_source: string | null;
  cv_media_id: string | null;
  cover_note: string | null;
  screening_answers: NonNullable<JobApplication["screeningAnswers"]> | null;
  criteria_match: JobApplication["criteriaMatch"] | null;
  internal_notes: NonNullable<JobApplication["internalNotes"]> | null;
  history: NonNullable<JobApplication["history"]> | null;
  status: JobApplication["status"];
  created_at: Timestamp;
  updated_at: Timestamp | null;
}

export const toJobApplication = (r: JobApplicationRow): JobApplication => ({
  id: r.id,
  candidateId: opt(r.candidate_id),
  jobId: r.job_id,
  jobTitle: r.job_title,
  applicantName: r.applicant_name,
  email: r.email,
  phone: opt(r.phone),
  currentCity: opt(r.current_city),
  countryOfResidence: opt(r.country_of_residence),
  currentJobTitle: opt(r.current_job_title),
  yearsExperience: opt(r.years_experience),
  qualification: opt(r.qualification),
  specialization: opt(r.specialization),
  currentEmployer: opt(r.current_employer),
  linkedinUrl: opt(r.linkedin_url),
  noticePeriod: opt(r.notice_period),
  workAuthorization: opt(r.work_authorization),
  skills: r.skills ?? [],
  applicationSource: opt(r.application_source),
  cvMediaId: opt(r.cv_media_id),
  coverNote: opt(r.cover_note),
  screeningAnswers: r.screening_answers ?? [],
  criteriaMatch: opt(r.criteria_match),
  internalNotes: r.internal_notes ?? [],
  history: r.history ?? [],
  status: r.status,
  createdAt: iso(r.created_at),
  updatedAt: r.updated_at ? iso(r.updated_at) : undefined,
});

/* -------------------------- general applications ------------------------- */

export interface GeneralApplicationRow {
  id: string;
  applicant_name: string;
  email: string;
  phone: string | null;
  discipline: string | null;
  sector: GeneralApplication["sector"] | null;
  cv_media_id: string | null;
  note: string | null;
  status: GeneralApplication["status"];
  created_at: Timestamp;
}

export const toGeneralApplication = (r: GeneralApplicationRow): GeneralApplication => ({
  id: r.id,
  applicantName: r.applicant_name,
  email: r.email,
  phone: opt(r.phone),
  discipline: opt(r.discipline),
  sector: opt(r.sector),
  cvMediaId: opt(r.cv_media_id),
  note: opt(r.note),
  status: r.status,
  createdAt: iso(r.created_at),
});

/* --------------------------------- media --------------------------------- */

export interface MediaRow {
  id: string;
  path: string;
  filename: string;
  alt: string;
  bucket: MediaItem["bucket"];
  mime_type: string;
  size_bytes: string | number;
  width: number | null;
  height: number | null;
  category: MediaItem["category"] | null;
  uploaded_at: Timestamp;
  uploaded_by: string;
}

export const toMedia = (r: MediaRow): MediaItem => ({
  id: r.id,
  path: r.path,
  filename: r.filename,
  alt: r.alt,
  bucket: r.bucket,
  mimeType: r.mime_type,
  sizeBytes: Number(r.size_bytes),
  width: opt(r.width),
  height: opt(r.height),
  category: opt(r.category),
  uploadedAt: iso(r.uploaded_at),
  uploadedBy: r.uploaded_by,
});

/* --------------------------------- audit --------------------------------- */

export interface AuditRow {
  id: string;
  ts: Timestamp;
  actor: string;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string;
  diff: unknown;
}

export const toAudit = (r: AuditRow): AuditEntry => ({
  id: r.id,
  ts: iso(r.ts),
  actor: r.actor,
  action: r.action,
  entity: r.entity,
  entityId: opt(r.entity_id),
  summary: r.summary,
  diff: r.diff ?? undefined,
});

/* -------------------------------- publish -------------------------------- */

export interface PublishRow {
  id: string;
  published_at: Timestamp;
  published_by: string;
  summary: string;
  changed_keys: string[];
}

export const toPublish = (r: PublishRow): PublishRecord => ({
  id: r.id,
  publishedAt: iso(r.published_at),
  publishedBy: r.published_by,
  summary: r.summary,
  changedKeys: r.changed_keys ?? [],
});
