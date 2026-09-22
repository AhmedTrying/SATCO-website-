/*
 * Neon SubmissionStore — contact submissions + job/general applications as Postgres
 * tables. Reads are inbox lists (newest first); updates patch a small, fixed set of
 * fields (status, assignee). The public careers endpoint inserts validated job
 * applications through the same adapter.
 */

import type {
  ContactSubmission,
  GeneralApplication,
  JobApplication,
} from "@satco/shared";

import type { NewJobApplication, SubmissionStore } from "../types";
import { makeId } from "../local/store";
import { jsonbParam, query, queryOne } from "../../db";
import {
  toContact,
  toGeneralApplication,
  toJobApplication,
  type ContactRow,
  type GeneralApplicationRow,
  type JobApplicationRow,
} from "./mappers";

function candidateIdForEmail(email: string): string {
  let hash = 5381;
  for (const char of email.trim().toLowerCase()) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }
  return `candidate-${(hash >>> 0).toString(36)}`;
}

export const neonSubmissionStore: SubmissionStore = {
  async listContact(): Promise<ContactSubmission[]> {
    const rows = await query<ContactRow>(
      "select * from contact_submissions order by created_at desc, seq asc",
    );
    return rows.map(toContact);
  },

  async updateContact(id, patch): Promise<ContactSubmission> {
    const existing = await queryOne<ContactRow>(
      "select * from contact_submissions where id = $1",
      [id],
    );
    if (!existing) throw new Error(`${id} not found in contact_submissions`);
    const merged = { ...toContact(existing), ...patch };
    const row = await queryOne<ContactRow>(
      "update contact_submissions set status = $1, assignee = $2, internal_note = $3, updated_at = $4 where id = $5 returning *",
      [
        merged.status,
        merged.assignee ?? null,
        merged.internalNote ?? null,
        new Date().toISOString(),
        id,
      ],
    );
    return toContact(row!);
  },

  async listApplications(): Promise<JobApplication[]> {
    const rows = await query<JobApplicationRow>(
      "select * from job_applications order by created_at desc, seq asc",
    );
    return rows.map(toJobApplication);
  },

  async createApplication(input: NewJobApplication): Promise<JobApplication> {
    const id = makeId("app");
    const createdAt = new Date().toISOString();
    const row = await queryOne<JobApplicationRow>(
      `insert into job_applications
         (id, candidate_id, job_id, job_title, applicant_name, email, phone,
          current_city, country_of_residence, current_job_title, years_experience,
          qualification, specialization, current_employer, linkedin_url, notice_period,
          work_authorization, skills, application_source, cv_media_id, cover_note,
          screening_answers, criteria_match, internal_notes, history, status, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
               $17, $18::jsonb, $19, $20, $21, $22::jsonb, $23, $24::jsonb, $25::jsonb,
               'new', $26, $27)
       returning *`,
      [
        id,
        input.candidateId ?? candidateIdForEmail(input.email),
        input.jobId,
        input.jobTitle,
        input.applicantName,
        input.email,
        input.phone ?? null,
        input.currentCity ?? null,
        input.countryOfResidence ?? null,
        input.currentJobTitle ?? null,
        input.yearsExperience ?? null,
        input.qualification ?? null,
        input.specialization ?? null,
        input.currentEmployer ?? null,
        input.linkedinUrl ?? null,
        input.noticePeriod ?? null,
        input.workAuthorization ?? null,
        jsonbParam(input.skills ?? []),
        input.applicationSource ?? "Careers website",
        input.cvMediaId ?? null,
        input.coverNote ?? null,
        jsonbParam(input.screeningAnswers ?? []),
        input.criteriaMatch ?? "needs-review",
        jsonbParam(input.internalNotes ?? []),
        jsonbParam(
          input.history ?? [
            { id: "submitted", label: "Application submitted", createdAt },
          ],
        ),
        createdAt,
        createdAt,
      ],
    );
    return toJobApplication(row!);
  },

  async updateApplication(id, patch): Promise<JobApplication> {
    const existing = await queryOne<JobApplicationRow>(
      "select * from job_applications where id = $1",
      [id],
    );
    if (!existing) throw new Error(`${id} not found in job_applications`);
    const merged = { ...toJobApplication(existing), ...patch };
    const row = await queryOne<JobApplicationRow>(
      `update job_applications
       set status = $1, internal_notes = $2::jsonb, history = $3::jsonb,
           criteria_match = $4, updated_at = $5
       where id = $6 returning *`,
      [
        merged.status,
        jsonbParam(merged.internalNotes ?? []),
        jsonbParam(merged.history ?? []),
        merged.criteriaMatch ?? null,
        new Date().toISOString(),
        id,
      ],
    );
    return toJobApplication(row!);
  },

  async listGeneralApplications(): Promise<GeneralApplication[]> {
    const rows = await query<GeneralApplicationRow>(
      "select * from general_applications order by created_at desc, seq asc",
    );
    return rows.map(toGeneralApplication);
  },

  async updateGeneralApplication(id, patch): Promise<GeneralApplication> {
    const existing = await queryOne<GeneralApplicationRow>(
      "select * from general_applications where id = $1",
      [id],
    );
    if (!existing) throw new Error(`${id} not found in general_applications`);
    const merged = { ...toGeneralApplication(existing), ...patch };
    const row = await queryOne<GeneralApplicationRow>(
      "update general_applications set status = $1 where id = $2 returning *",
      [merged.status, id],
    );
    return toGeneralApplication(row!);
  },
};
