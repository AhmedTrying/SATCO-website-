/*
 * Google sign-in (OpenID Connect authorization-code flow) without an auth
 * library. Three steps:
 *   1. /api/auth/google          → redirect to Google with a random `state`
 *   2. Google → /api/auth/google/callback?code&state
 *   3. exchange the code, read the verified email, match it against the staff
 *      directory, issue our own session cookie (lib/auth/session.ts).
 *
 * Google only tells us WHO signed in. Whether they may enter, and with which role
 * and inboxes, is decided by the `users` table — an unknown or deactivated email
 * is turned away even with a valid Google account.
 *
 * Setup (free): Google Cloud console → APIs & Services → Credentials →
 * OAuth client ID (Web application); authorised redirect URI =
 * <dashboard origin>/api/auth/google/callback. Put the id/secret in env.
 */

const AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

export const OAUTH_STATE_COOKIE = "satco_oauth_state";

export interface GoogleProfile {
  email: string;
  emailVerified: boolean;
  name?: string;
  /** Google Workspace domain of the account, when it belongs to one. */
  hostedDomain?: string;
}

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
}

/** Workspace domain to restrict sign-in to (e.g. satco.sa). Optional. */
export function allowedDomain(): string | undefined {
  return process.env.AUTH_ALLOWED_DOMAIN?.trim().toLowerCase() || undefined;
}

/** The callback URL registered with Google; derived from the request origin
 *  unless AUTH_URL pins the public dashboard origin (recommended on Vercel). */
export function redirectUri(requestOrigin: string): string {
  const base = process.env.AUTH_URL?.trim().replace(/\/+$/, "") || requestOrigin;
  return `${base}/api/auth/google/callback`;
}

export function authorizeUrl(requestOrigin: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
    redirect_uri: redirectUri(requestOrigin),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });
  const domain = allowedDomain();
  if (domain) params.set("hd", domain);
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

export async function exchangeCode(
  code: string,
  requestOrigin: string,
): Promise<{ accessToken: string }> {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
    client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
    redirect_uri: redirectUri(requestOrigin),
    grant_type: "authorization_code",
  });
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`Google token exchange failed (HTTP ${response.status}).`);
  }
  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Google returned no access token.");
  return { accessToken: json.access_token };
}

export async function fetchProfile(accessToken: string): Promise<GoogleProfile> {
  const response = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`Google userinfo failed (HTTP ${response.status}).`);
  }
  const json = (await response.json()) as {
    email?: string;
    email_verified?: boolean;
    name?: string;
    hd?: string;
  };
  if (!json.email) throw new Error("Google returned no email address.");
  return {
    email: json.email.trim().toLowerCase(),
    emailVerified: json.email_verified === true,
    name: json.name,
    hostedDomain: json.hd?.toLowerCase(),
  };
}
