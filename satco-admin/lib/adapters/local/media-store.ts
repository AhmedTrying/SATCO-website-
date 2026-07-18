/*
 * Local MediaStore — an index (media.json) plus files written under public/uploads.
 * Alt text is required (a11y) for public media. TODO(supabase): Storage buckets
 * (public-media + private-uploads) with signed URLs for the private bucket.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import type { MediaBucket, MediaItem } from "@satco/shared";

import type { MediaStore, NewMedia } from "../types";
import { makeId, readStore, writeStore } from "./store";

const FILE = "media.json";
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

async function all(): Promise<MediaItem[]> {
  return readStore<MediaItem[]>(FILE);
}

export const localMediaStore: MediaStore = {
  async list(bucket?: MediaBucket): Promise<MediaItem[]> {
    const items = await all();
    return bucket ? items.filter((m) => m.bucket === bucket) : items;
  },

  async get(id: string): Promise<MediaItem | undefined> {
    return (await all()).find((m) => m.id === id);
  },

  async add(item: NewMedia, uploadedBy: string): Promise<MediaItem> {
    if (item.bucket === "public-media" && !item.alt.trim()) {
      throw new Error("Alt text is required for public media (accessibility).");
    }
    const id = makeId("media");
    let publicPath = `/uploads/${id}-${item.filename}`;

    if (item.dataBase64) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const bytes = Buffer.from(item.dataBase64, "base64");
      await fs.writeFile(path.join(UPLOAD_DIR, `${id}-${item.filename}`), bytes);
    } else {
      // No bytes provided (index-only entry).
      publicPath = `/uploads/${id}-${item.filename}`;
    }

    const record: MediaItem = {
      id,
      path: publicPath,
      filename: item.filename,
      alt: item.alt,
      bucket: item.bucket,
      mimeType: item.mimeType,
      sizeBytes: item.sizeBytes,
      width: item.width,
      height: item.height,
      category: item.category,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    };
    const items = await all();
    items.unshift(record);
    await writeStore(FILE, items);
    return record;
  },

  async updateAlt(id: string, alt: string): Promise<MediaItem> {
    const items = await all();
    const i = items.findIndex((m) => m.id === id);
    if (i < 0) throw new Error(`Media ${id} not found`);
    if (items[i].bucket === "public-media" && !alt.trim()) {
      throw new Error("Alt text is required for public media (accessibility).");
    }
    items[i] = { ...items[i], alt };
    await writeStore(FILE, items);
    return items[i];
  },

  async remove(id: string): Promise<void> {
    const items = await all();
    const item = items.find((m) => m.id === id);
    await writeStore(
      FILE,
      items.filter((m) => m.id !== id),
    );
    // Best-effort delete of the uploaded file (ignore if it was an index-only entry).
    if (item?.path.startsWith("/uploads/")) {
      await fs
        .unlink(path.join(process.cwd(), "public", item.path))
        .catch(() => undefined);
    }
  },
};
