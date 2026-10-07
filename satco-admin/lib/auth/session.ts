/*
 * Session cookie — a signed, httpOnly cookie carrying only the user id and an
 * expiry. Everything else (name, role, inboxes, active) is re-read from the user
 * store on every request, so revoking or re-roling a user takes effect at once.
 *
 * Signature: HMAC-SHA256 over the base64url payload with AUTH_SECRET. Tampered or
 * expired cookies read as "signed out". No external auth library is needed.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";

export const SESSION_COOKIE = "satco_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

interface SessionPayload {
  uid: string;
  exp: number; // unix seconds
}

function secret(): string {
  const value = process.env.AUTH_SECRET?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET is not set. Generate one with `openssl rand -base64 32`.");
  }
  // Local development only — a stable placeholder so dev sessions survive restarts.
  return "satco-admin-dev-secret-not-for-production";
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function encodeSession(uid: string): string {
  const payload: SessionPayload = {
    uid,
    exp: Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

export function decodeSession(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (!payload?.uid || typeof payload.exp !== "number") return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

/** Issue a session for `uid`. Must run in a server action or route handler. */
export async function createSession(uid: string): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, encodeSession(uid), cookieOptions());
}

/** The user id from a valid session cookie, or null. */
export async function readSessionUserId(): Promise<string | null> {
  const jar = await cookies();
  return decodeSession(jar.get(SESSION_COOKIE)?.value)?.uid ?? null;
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
