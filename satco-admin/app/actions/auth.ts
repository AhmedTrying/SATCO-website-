"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { roleSchema } from "@satco/shared/schemas";

import { adapters } from "@/lib/adapters";

/** Mock dev sign-in by email (one of the seeded staff accounts). */
export async function signInAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;
  await adapters.auth.signIn(email);
  redirect("/overview");
}

export async function signOutAction(): Promise<void> {
  await adapters.auth.signOut();
  redirect("/login");
}

/** Role switcher (mock only) — preview permissions across roles. */
export async function setRoleAction(role: string): Promise<void> {
  const parsed = roleSchema.parse(role);
  await adapters.auth.setRole(parsed);
  revalidatePath("/", "layout");
}
