"use server";

import { revalidatePath } from "next/cache";

import type { MediaBucket, MediaItem } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import type { NewMedia } from "@/lib/adapters/types";
import { requireCapability } from "@/lib/auth";

export interface MediaResult {
  ok: boolean;
  error?: string;
  item?: MediaItem;
}

export async function uploadMedia(input: NewMedia): Promise<MediaResult> {
  try {
    const session = await requireCapability("edit");
    if (input.bucket === "public-media" && !input.alt.trim()) {
      return { ok: false, error: "Alt text is required for public media." };
    }
    const item = await adapters.media.add(input, session.email);
    await adapters.audit.append({
      actor: session.email,
      action: "media.upload",
      entity: "media",
      entityId: item.id,
      summary: `Uploaded ${item.filename} to ${item.bucket}.`,
    });
    revalidatePath("/media");
    return { ok: true, item };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Upload failed" };
  }
}

export async function updateMediaAlt(
  id: string,
  alt: string,
): Promise<MediaResult> {
  try {
    const session = await requireCapability("edit");
    const item = await adapters.media.updateAlt(id, alt);
    await adapters.audit.append({
      actor: session.email,
      action: "media.updateAlt",
      entity: "media",
      entityId: id,
      summary: `Updated alt text for ${item.filename}.`,
    });
    revalidatePath("/media");
    return { ok: true, item };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Update failed" };
  }
}

export async function removeMedia(id: string): Promise<MediaResult> {
  try {
    const session = await requireCapability("edit");
    await adapters.media.remove(id);
    await adapters.audit.append({
      actor: session.email,
      action: "media.remove",
      entity: "media",
      entityId: id,
      summary: `Removed media ${id}.`,
    });
    revalidatePath("/media");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Delete failed" };
  }
}

export type { MediaBucket };
