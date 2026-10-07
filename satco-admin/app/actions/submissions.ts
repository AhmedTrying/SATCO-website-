"use server";

import { revalidatePath } from "next/cache";

import type { ContactSubmission, SubmissionStatus } from "@satco/shared";
import { submissionStatusSchema } from "@satco/shared/schemas";

import { adapters } from "@/lib/adapters";
import { canInbox, requireSession } from "@/lib/auth";
import { inboxHref } from "@/lib/nav";

export interface SubmissionResult {
  ok: boolean;
  error?: string;
}

/**
 * Update one inquiry. Access is per inbox: the caller must be allowed to open
 * the inbox the inquiry belongs to (admins: all).
 */
export async function updateSubmission(
  id: string,
  patch: Partial<Pick<ContactSubmission, "status" | "assignee" | "internalNote">>,
): Promise<SubmissionResult> {
  try {
    const session = await requireSession();
    const existing = await adapters.submissions.getContact(id);
    if (!existing) return { ok: false, error: "This inquiry no longer exists." };
    if (!canInbox(session, existing.inquiryType)) {
      return { ok: false, error: "You do not have access to this inbox." };
    }
    if (patch.status !== undefined) submissionStatusSchema.parse(patch.status);

    await adapters.submissions.updateContact(id, patch);
    const bits = [
      patch.status ? `status → ${patch.status}` : null,
      patch.assignee !== undefined
        ? `assigned → ${patch.assignee || "unassigned"}`
        : null,
      patch.internalNote !== undefined ? "note updated" : null,
    ].filter(Boolean);
    await adapters.audit.append({
      actor: session.email,
      action: "inquiry.update",
      entity: "inquiry",
      entityId: id,
      summary: `Inquiry ${id} (${existing.inquiryType}): ${bits.join(", ")}.`,
    });
    revalidatePath("/inquiries");
    revalidatePath(inboxHref(existing.inquiryType));
    revalidatePath("/overview");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function setSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): Promise<SubmissionResult> {
  try {
    return updateSubmission(id, { status: submissionStatusSchema.parse(status) });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
