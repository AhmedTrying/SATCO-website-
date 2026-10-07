"use server";

import { revalidatePath } from "next/cache";

import type { AccessPage, Role, UserAccount } from "@satco/shared";
import { accessPageSchema, roleSchema } from "@satco/shared/schemas";
import { z } from "zod";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export interface UserResult {
  ok: boolean;
  error?: string;
  user?: UserAccount;
}

const newUserSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  role: roleSchema,
  access: z.array(accessPageSchema).default([]),
});

function fail(e: unknown): UserResult {
  if (e instanceof z.ZodError) {
    const i = e.issues[0];
    return { ok: false, error: `${i.path.join(".") || "value"}: ${i.message}` };
  }
  return { ok: false, error: e instanceof Error ? e.message : "Failed" };
}

/** Add a staff account. They sign in with the Google account for this email. */
export async function addUser(data: unknown): Promise<UserResult> {
  try {
    const session = await requireCapability("admin");
    const input = newUserSchema.parse(data);
    const user = await adapters.users.create(input);
    await adapters.audit.append({
      actor: session.email,
      action: "user.create",
      entity: "user",
      entityId: user.id,
      summary: `Added ${user.email} as ${user.role}${user.access.length ? ` (pages: ${user.access.join(", ")})` : ""}.`,
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
    if (id === session.userId && parsed !== "admin") {
      return { ok: false, error: "You cannot remove your own admin role." };
    }
    const user = await adapters.users.update(id, { role: parsed });
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

/** Grant or revoke the pages this user may open. */
export async function setUserAccess(
  id: string,
  access: AccessPage[],
): Promise<UserResult> {
  try {
    const session = await requireCapability("admin");
    const parsed = z.array(accessPageSchema).parse(access);
    const user = await adapters.users.update(id, { access: parsed });
    await adapters.audit.append({
      actor: session.email,
      action: "user.setAccess",
      entity: "user",
      entityId: id,
      summary: `${user.email} pages → ${parsed.length ? parsed.join(", ") : "none"}.`,
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
    if (id === session.userId && !active) {
      return { ok: false, error: "You cannot deactivate your own account." };
    }
    const user = await adapters.users.update(id, { active });
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
