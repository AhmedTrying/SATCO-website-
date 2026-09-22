/*
 * Local SubmissionStore — contact submissions + job/general applications as JSON,
 * seeded with sample inbox data. TODO(supabase): insert-from-site (anon, RLS) +
 * inbox reads (publisher/admin). Interface unchanged.
 */

import type {
  ContactSubmission,
  GeneralApplication,
  JobApplication,
} from "@satco/shared";

import type { NewJobApplication, SubmissionStore } from "../types";
import { makeId, readStore, writeStore } from "./store";

const CONTACT = "submissions.json";
const APPS = "applications.json";
const GENERAL = "general-applications.json";

function candidateIdForEmail(email: string): string {
  let hash = 5381;
  for (const char of email.trim().toLowerCase()) {
    hash = (hash * 33) ^ char.charCodeAt(0);
  }
  return `candidate-${(hash >>> 0).toString(36)}`;
}

async function patchItem<T extends { id: string }>(
  file: string,
  id: string,
  patch: Partial<T>,
): Promise<T> {
  const items = await readStore<T[]>(file);
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) throw new Error(`${id} not found in ${file}`);
  items[i] = { ...items[i], ...patch };
  await writeStore(file, items);
  return items[i];
}

export const localSubmissionStore: SubmissionStore = {
  listContact(): Promise<ContactSubmission[]> {
    return readStore<ContactSubmission[]>(CONTACT);
  },
  updateContact(id, patch): Promise<ContactSubmission> {
    return patchItem<ContactSubmission>(CONTACT, id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  },
  listApplications(): Promise<JobApplication[]> {
    return readStore<JobApplication[]>(APPS);
  },
  async createApplication(input: NewJobApplication): Promise<JobApplication> {
    const items = await readStore<JobApplication[]>(APPS);
    const createdAt = new Date().toISOString();
    const record: JobApplication = {
      ...input,
      id: makeId("app"),
      candidateId: input.candidateId ?? candidateIdForEmail(input.email),
      status: "new",
      criteriaMatch: input.criteriaMatch ?? "needs-review",
      history:
        input.history ?? [
          { id: "submitted", label: "Application submitted", createdAt },
        ],
      createdAt,
      updatedAt: createdAt,
    };
    items.unshift(record);
    await writeStore(APPS, items);
    return record;
  },
  updateApplication(id, patch): Promise<JobApplication> {
    return patchItem<JobApplication>(APPS, id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
  },
  listGeneralApplications(): Promise<GeneralApplication[]> {
    return readStore<GeneralApplication[]>(GENERAL);
  },
  updateGeneralApplication(id, patch): Promise<GeneralApplication> {
    return patchItem<GeneralApplication>(GENERAL, id, patch);
  },
};
