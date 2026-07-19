/*
 * Neon ContentStore — draft + published ContentBundle as two JSONB rows in
 * `content_bundle` (status = 'draft' | 'published'). Mirrors the local store's
 * whole-bundle semantics: getDraft/saveDraft/getPublished operate on the entire
 * bundle, so components and the Publish center are unchanged.
 */

import type { ContentBundle } from "@satco/shared";

import type { ContentStore } from "../types";
import { query, queryOne, jsonbParam } from "../../db";

interface BundleRow {
  data: ContentBundle;
}

async function getDraft(): Promise<ContentBundle> {
  const row = await queryOne<BundleRow>(
    "select data from content_bundle where status = 'draft'",
  );
  if (!row) {
    throw new Error(
      "No draft content_bundle row — run `npm run db:seed` to seed the Neon backend.",
    );
  }
  return row.data;
}

async function getPublished(): Promise<ContentBundle> {
  const row = await queryOne<BundleRow>(
    "select data from content_bundle where status = 'published'",
  );
  // Before the first publish the published row mirrors the draft (matches the local
  // backend's seed fallback), so unpublished edits still surface as a real diff.
  if (row) return row.data;
  return getDraft();
}

export const neonContentStore: ContentStore = {
  getDraft,
  getPublished,
  async saveDraft(bundle: ContentBundle): Promise<void> {
    await query(
      `insert into content_bundle (status, data, updated_at)
       values ('draft', $1::jsonb, now())
       on conflict (status) do update set data = excluded.data, updated_at = now()`,
      [jsonbParam(bundle)],
    );
  },
};

/** Internal helper used by the Neon PublishService to snapshot draft → published. */
export async function writePublishedSnapshot(bundle: ContentBundle): Promise<void> {
  await query(
    `insert into content_bundle (status, data, updated_at)
     values ('published', $1::jsonb, now())
     on conflict (status) do update set data = excluded.data, updated_at = now()`,
    [jsonbParam(bundle)],
  );
}
