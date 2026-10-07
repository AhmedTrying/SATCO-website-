"use server";

import { redirect } from "next/navigation";

import { adapters } from "@/lib/adapters";
import { authMode } from "@/lib/auth";
import { clearSession, createSession } from "@/lib/auth/session";

/**
 * Mock sign-in by email — one of the staff accounts in the user store.
 * Refused outright unless the mock mode is active (never in production unless
 * ALLOW_MOCK_AUTH=true). Real sign-in is Google: /api/auth/google.
 */
export async function mockSignInAction(formData: FormData): Promise<void> {
  if (authMode() !== "mock") redirect("/login?error=mock-disabled");
  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/login?error=no-account");
  const user = await adapters.users.getByEmail(email);
  if (!user || !user.active) redirect("/login?error=no-account");
  await createSession(user.id);
  redirect("/overview");
}

export async function signOutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
