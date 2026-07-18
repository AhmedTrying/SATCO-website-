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

import type { SubmissionStore } from "../types";
import { readStore, writeStore } from "./store";

const CONTACT = "submissions.json";
const APPS = "applications.json";
const GENERAL = "general-applications.json";

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
    return patchItem<ContactSubmission>(CONTACT, id, patch);
  },
  listApplications(): Promise<JobApplication[]> {
    return readStore<JobApplication[]>(APPS);
  },
  updateApplication(id, patch): Promise<JobApplication> {
    return patchItem<JobApplication>(APPS, id, patch);
  },
  listGeneralApplications(): Promise<GeneralApplication[]> {
    return readStore<GeneralApplication[]>(GENERAL);
  },
  updateGeneralApplication(id, patch): Promise<GeneralApplication> {
    return patchItem<GeneralApplication>(GENERAL, id, patch);
  },
};
