"use server";

import { revalidatePath } from "next/cache";

import type { PublishRecord } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface PublishResult {
  ok: boolean;
  error?: string;
  record?: PublishRecord;
}

export async function publishAction(): Promise<PublishResult> {
  try {
    const session = await requireCapability("publish");
    const record = await adapters.publish.publish(session.email);
    revalidatePath("/publish");
    revalidatePath("/overview");
    return { ok: true, record };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Publish failed" };
  }
}
