/*
 * Neon MediaStore — the `media` index table. File bytes still land under
 * public/uploads locally (object storage + signed URLs for private-uploads later);
 * only the index row moves to Postgres. The required-alt-text rule for public media
 * (a11y) is preserved. Interface unchanged.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import type { MediaBucket, MediaItem } from "@satco/shared";

import type { MediaStore, NewMedia } from "../types";
import { makeId } from "../local/store";
import { query, queryOne } from "../../db";
import { toMedia, type MediaRow } from "./mappers";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const neonMediaStore: MediaStore = {
  async list(bucket?: MediaBucket): Promise<MediaItem[]> {
    const rows = bucket
      ? await query<MediaRow>(
          "select * from media where bucket = $1 order by uploaded_at desc, seq asc",
          [bucket],
        )
      : await query<MediaRow>("select * from media order by uploaded_at desc, seq asc");
    return rows.map(toMedia);
  },

  async get(id: string): Promise<MediaItem | undefined> {
    const row = await queryOne<MediaRow>("select * from media where id = $1", [id]);
    return row ? toMedia(row) : undefined;
  },

  async add(item: NewMedia, uploadedBy: string): Promise<MediaItem> {
    if (item.bucket === "public-media" && !item.alt.trim()) {
      throw new Error("Alt text is required for public media (accessibility).");
    }
    const id = makeId("media");
    const publicPath = `/uploads/${id}-${item.filename}`;

    if (item.dataBase64) {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const bytes = Buffer.from(item.dataBase64, "base64");
      await fs.writeFile(path.join(UPLOAD_DIR, `${id}-${item.filename}`), bytes);
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
    await query(
      `insert into media
         (id, path, filename, alt, bucket, mime_type, size_bytes, width, height, category, uploaded_at, uploaded_by)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        record.id,
        record.path,
        record.filename,
        record.alt,
        record.bucket,
        record.mimeType,
        record.sizeBytes,
        record.width ?? null,
        record.height ?? null,
        record.category ?? null,
        record.uploadedAt,
        record.uploadedBy,
      ],
    );
    return record;
  },

  async updateAlt(id: string, alt: string): Promise<MediaItem> {
    const existing = await queryOne<MediaRow>("select * from media where id = $1", [id]);
    if (!existing) throw new Error(`Media ${id} not found`);
    if (existing.bucket === "public-media" && !alt.trim()) {
      throw new Error("Alt text is required for public media (accessibility).");
    }
    const row = await queryOne<MediaRow>(
      "update media set alt = $1 where id = $2 returning *",
      [alt, id],
    );
    return toMedia(row!);
  },

  async remove(id: string): Promise<void> {
    const existing = await queryOne<MediaRow>("select * from media where id = $1", [id]);
    await query("delete from media where id = $1", [id]);
    // Best-effort delete of the uploaded file (seed rows point at /images/*, not
    // /uploads/*, and are left untouched).
    if (existing?.path?.startsWith("/uploads/")) {
      await fs
        .unlink(path.join(process.cwd(), "public", existing.path))
        .catch(() => undefined);
    }
  },
};
