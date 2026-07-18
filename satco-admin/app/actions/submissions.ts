"use server";

import { revalidatePath } from "next/cache";

import type { ContactSubmission, SubmissionStatus } from "@satco/shared";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface SubmissionResult {
  ok: boolean;
  error?: string;
}

export async function updateSubmission(
  id: string,
  patch: Partial<Pick<ContactSubmission, "status" | "assignee">>,
): Promise<SubmissionResult> {
  try {
    const session = await requireCapability("manageJobs");
    await adapters.submissions.updateContact(id, patch);
    const bits = [
      patch.status ? `status → ${patch.status}` : null,
      patch.assignee !== undefined
        ? `assigned → ${patch.assignee || "unassigned"}`
        : null,
    ].filter(Boolean);
    await adapters.audit.append({
      actor: session.email,
      action: "submission.update",
      entity: "submission",
      entityId: id,
      summary: `Submission ${id}: ${bits.join(", ")}.`,
    });
    revalidatePath("/contact");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

/** Only status is validated against the allowed set here. */
export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionResult> {
  return updateSubmission(id, { status });
}
