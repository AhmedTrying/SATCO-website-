"use server";

import { revalidatePath } from "next/cache";

import type {
  ApplicationStatus,
  GeneralApplicationStatus,
  JobApplication,
} from "@satco/shared";
import { applicationStatusSchema } from "@satco/shared/schemas";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function setApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<ActionResult> {
  try {
    const session = await requireCapability("manageJobs");
    const parsed = applicationStatusSchema.parse(status);
    const current = (await adapters.submissions.listApplications()).find(
      (application) => application.id === id,
    );
    if (!current) throw new Error("Application not found.");
    const history: NonNullable<JobApplication["history"]> = [
      ...(current.history ?? []),
      {
        id: `status-${Date.now()}`,
        label: "Stage updated",
        detail: parsed,
        createdAt: new Date().toISOString(),
      },
    ];
    await adapters.submissions.updateApplication(id, { status: parsed, history });
    await adapters.audit.append({
      actor: session.email,
      action: "application.status",
      entity: "application",
      entityId: id,
      summary: `Application ${id} → ${status}.`,
    });
    revalidatePath("/careers");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function setGeneralApplicationStatus(
  id: string,
  status: GeneralApplicationStatus,
): Promise<ActionResult> {
  try {
    const session = await requireCapability("manageJobs");
    await adapters.submissions.updateGeneralApplication(id, { status });
    await adapters.audit.append({
      actor: session.email,
      action: "generalApplication.status",
      entity: "generalApplication",
      entityId: id,
      summary: `General application ${id} → ${status}.`,
    });
    revalidatePath("/careers");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function addApplicationNote(
  id: string,
  body: string,
): Promise<ActionResult> {
  try {
    const session = await requireCapability("manageJobs");
    const text = body.trim();
    if (!text) return { ok: false, error: "Enter a note before saving." };
    if (text.length > 3000) {
      return { ok: false, error: "Notes must be 3,000 characters or fewer." };
    }
    const current = (await adapters.submissions.listApplications()).find(
      (application) => application.id === id,
    );
    if (!current) throw new Error("Application not found.");
    const createdAt = new Date().toISOString();
    const internalNotes = [
      ...(current.internalNotes ?? []),
      { id: `note-${Date.now()}`, body: text, author: session.email, createdAt },
    ];
    const history = [
      ...(current.history ?? []),
      { id: `note-${Date.now()}`, label: "Internal note added", createdAt },
    ];
    await adapters.submissions.updateApplication(id, { internalNotes, history });
    await adapters.audit.append({
      actor: session.email,
      action: "application.note",
      entity: "application",
      entityId: id,
      summary: `Added an internal note to application ${id}.`,
    });
    revalidatePath("/careers");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
