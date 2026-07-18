/*
 * Local ContentStore — drafts + published snapshot as JSON files.
 * TODO(supabase): back draft/published with Postgres rows carrying status,
 * updated_by, sort_order; the interface is unchanged.
 */

import type { ContentBundle } from "@satco/shared";

import type { ContentStore } from "../types";
import { readSeed, readStore, writeStore } from "./store";

const DRAFT = "content.json"; // draft lives at store/content.json (seed fallback)
const PUBLISHED = "content-published.json";

export const localContentStore: ContentStore = {
  async getDraft(): Promise<ContentBundle> {
    return readStore<ContentBundle>(DRAFT);
  },

  async saveDraft(bundle: ContentBundle): Promise<void> {
    await writeStore(DRAFT, bundle);
  },

  async getPublished(): Promise<ContentBundle> {
    // Before the first publish, the published snapshot IS the committed seed
    // (what the live site currently reflects) — read the seed directly, NOT the
    // mutable draft, so unpublished edits show up as a real diff.
    try {
      return await readStore<ContentBundle>(PUBLISHED);
    } catch {
      return readSeed<ContentBundle>(DRAFT);
    }
  },
};

/** Internal helper used by PublishService to snapshot draft → published. */
export async function writePublishedSnapshot(bundle: ContentBundle): Promise<void> {
  await writeStore(PUBLISHED, bundle);
}
