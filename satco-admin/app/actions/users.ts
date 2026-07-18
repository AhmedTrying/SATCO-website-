"use server";

import { revalidatePath } from "next/cache";

import type { Role, UserAccount } from "@satco/shared";
import { roleSchema } from "@satco/shared/schemas";
import { z } from "zod";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface UserResult {
  ok: boolean;
  error?: string;
  user?: UserAccount;
}

const newUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: roleSchema,
});

function fail(e: unknown): UserResult {
  if (e instanceof z.ZodError) {
    const i = e.issues[0];
    return { ok: false, error: `${i.path.join(".") || "value"}: ${i.message}` };
  }
  return { ok: false, error: e instanceof Error ? e.message : "Failed" };
}

export async function inviteUser(data: unknown): Promise<UserResult> {
  try {
    const session = await requireCapability("admin");
    const input = newUserSchema.parse(data);
    const user = await adapters.auth.createUser(input);
    await adapters.audit.append({
      actor: session.email,
      action: "user.create",
      entity: "user",
      entityId: user.id,
      summary: `Invited ${user.email} as ${user.role}.`,
    });
    revalidatePath("/users");
    return { ok: true, user };
  } catch (e) {
    return fail(e);
  }
}

export async function setUserRole(id: string, role: Role): Promise<UserResult> {
  try {
    const session = await requireCapability("admin");
    const parsed = roleSchema.parse(role);
    const user = await adapters.auth.updateUser(id, { role: parsed });
    await adapters.audit.append({
      actor: session.email,
      action: "user.setRole",
      entity: "user",
      entityId: id,
      summary: `${user.email} → ${parsed}.`,
    });
    revalidatePath("/users");
    return { ok: true, user };
  } catch (e) {
    return fail(e);
  }
}

export async function setUserActive(
  id: string,
  active: boolean,
): Promise<UserResult> {
  try {
    const session = await requireCapability("admin");
    const user = await adapters.auth.updateUser(id, { active });
    await adapters.audit.append({
      actor: session.email,
      action: "user.setActive",
      entity: "user",
      entityId: id,
      summary: `${user.email} ${active ? "activated" : "deactivated"}.`,
    });
    revalidatePath("/users");
    return { ok: true, user };
  } catch (e) {
    return fail(e);
  }
}
