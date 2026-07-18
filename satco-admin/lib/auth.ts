/*
 * Server-side auth/permission helpers. Route gating built now against MockAuth
 * so it's ready the moment Supabase Auth lands (dashboard kickoff §3, plan §4).
 */

import { redirect } from "next/navigation";

import { roleCan, type RoleCapability } from "@satco/shared";

import { adapters, type Session } from "./adapters";

export async function getSession(): Promise<Session | null> {
  return adapters.auth.getSession();
}

/** Redirect to /login when there is no session. */
export async function requireSession(): Promise<Session> {
  const session = await adapters.auth.getSession();
  if (!session) redirect("/login");
  return session;
}

/** Require a capability; send unauthorized users to a 403 screen. */
export async function requireCapability(cap: RoleCapability): Promise<Session> {
  const session = await requireSession();
  if (!roleCan(session.role, cap)) redirect("/denied");
  return session;
}

export function can(session: Session, cap: RoleCapability): boolean {
  return roleCan(session.role, cap);
}
