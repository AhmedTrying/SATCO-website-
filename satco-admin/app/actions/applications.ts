"use server";

import { revalidatePath } from "next/cache";

import type { ApplicationStatus, GeneralApplicationStatus } from "@satco/shared";

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
    await adapters.submissions.updateApplication(id, { status });
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
