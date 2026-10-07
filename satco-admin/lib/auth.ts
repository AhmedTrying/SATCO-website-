/*
 * Server-side auth/permission helpers.
 *
 * Sign-in: Google (lib/auth/google.ts) when GOOGLE_CLIENT_ID/SECRET are set;
 * otherwise a mock account picker, which is ONLY available outside production
 * (or with ALLOW_MOCK_AUTH=true for a throwaway preview). The session cookie
 * carries just the user id (lib/auth/session.ts); role and page access come from the
 * user store on every request.
 *
 * Gating: pages call requireCapability()/requireInbox() server-side (redirect to
 * /denied); nav visibility is filtered with the same helpers in the Shell.
 */

import { redirect } from "next/navigation";

import {
  canAccessInbox,
  userCan,
  type InquiryType,
  type RoleCapability,
} from "@satco/shared";

import { adapters, type Session } from "./adapters";
import { googleConfigured } from "./auth/google";
import { clearSession, readSessionUserId } from "./auth/session";

export type AuthMode = "google" | "mock" | "none";

/** Which sign-in method the login page offers. */
export function authMode(): AuthMode {
  if (googleConfigured()) return "google";
  const mockAllowed =
    process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_AUTH === "true";
  return mockAllowed ? "mock" : "none";
}

export async function getSession(): Promise<Session | null> {
  const uid = await readSessionUserId();
  if (!uid) return null;
  const user = await adapters.users.getById(uid);
  if (!user || !user.active) {
    await clearSession().catch(() => undefined);
    return null;
  }
  return {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    access: user.access,
  };
}

/** Redirect to /login when there is no session. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/** Require a capability; send unauthorized users to a 403 screen. */
export async function requireCapability(cap: RoleCapability): Promise<Session> {
  const session = await requireSession();
  if (!userCan(session, cap)) redirect("/denied");
  return session;
}

/** Require access to one inquiry inbox (per-page access control). */
export async function requireInbox(inbox: InquiryType): Promise<Session> {
  const session = await requireSession();
  if (!canAccessInbox(session, inbox)) redirect("/denied");
  return session;
}

export function can(session: Session, cap: RoleCapability): boolean {
  return userCan(session, cap);
}

export function canInbox(session: Session, inbox: InquiryType): boolean {
  return canAccessInbox(session, inbox);
}
