"use server";

import { revalidatePath } from "next/cache";

import type { FeatureFlags } from "@satco/shared";
import { featureFlagsSchema } from "@satco/shared/schemas";
import { z } from "zod";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface FlagsResult {
  ok: boolean;
  error?: string;
}

export async function saveFlags(data: unknown): Promise<FlagsResult> {
  try {
    const session = await requireCapability("admin");
    const flags = featureFlagsSchema.parse(data) as FeatureFlags;
    const draft = await adapters.content.getDraft();
    // Keep the site's existing canonical fields in sync with the flag catalog so
    // the two overlapping controls never diverge (the site reads these fields):
    //  - show_pending_experience mirrors bundle.showPendingExperience (sectors)
    //  - show_vendor_tab mirrors bundle.site.flags.showVendorsTab (nav)
    await adapters.content.saveDraft({
      ...draft,
      flags,
      showPendingExperience: flags.show_pending_experience,
      site: {
        ...draft.site,
        flags: { ...draft.site.flags, showVendorsTab: flags.show_vendor_tab },
      },
    });
    await adapters.audit.append({
      actor: session.email,
      action: "flags.update",
      entity: "flags",
      summary: "Updated feature flags & settings.",
      diff: flags,
    });
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    if (e instanceof z.ZodError) {
      const i = e.issues[0];
      return { ok: false, error: `${i.path.join(".") || "value"}: ${i.message}` };
    }
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
