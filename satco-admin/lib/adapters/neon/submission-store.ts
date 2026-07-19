/*
 * Neon SubmissionStore — contact submissions + job/general applications as Postgres
 * tables. Reads are inbox lists (newest first); updates patch a small, fixed set of
 * fields (status, assignee). Site-side insert-from-form (anon) arrives with the
 * public forms phase — see docs/NEON-SWAP.md. Interface unchanged.
 */

import type {
  ContactSubmission,
  GeneralApplication,
  JobApplication,
} from "@satco/shared";

import type { SubmissionStore } from "../types";
import { query, queryOne } from "../../db";
import {
  toContact,
  toGeneralApplication,
  toJobApplication,
  type ContactRow,
  type GeneralApplicationRow,
  type JobApplicationRow,
} from "./mappers";

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
      "update contact_submissions set status = $1, assignee = $2 where id = $3 returning *",
      [merged.status, merged.assignee ?? null, id],
    );
    return toContact(row!);
  },

  async listApplications(): Promise<JobApplication[]> {
    const rows = await query<JobApplicationRow>(
      "select * from job_applications order by created_at desc, seq asc",
    );
    return rows.map(toJobApplication);
  },

  async updateApplication(id, patch): Promise<JobApplication> {
    const existing = await queryOne<JobApplicationRow>(
      "select * from job_applications where id = $1",
      [id],
    );
    if (!existing) throw new Error(`${id} not found in job_applications`);
    const merged = { ...toJobApplication(existing), ...patch };
    const row = await queryOne<JobApplicationRow>(
      "update job_applications set status = $1 where id = $2 returning *",
      [merged.status, id],
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
