import { cookies } from "next/headers";

import { adapters } from "@/lib/adapters";
import {
  allowedDomain,
  exchangeCode,
  fetchProfile,
  googleConfigured,
  OAUTH_STATE_COOKIE,
} from "@/lib/auth/google";
import { createSession } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function back(request: Request, error: string): Response {
  return Response.redirect(new URL(`/login?error=${error}`, request.url), 302);
}

/**
 * Step 2 of Google sign-in: verify the state, trade the code for the verified
 * email, match it against the staff directory, and issue our session cookie.
 */
export async function GET(request: Request): Promise<Response> {
  if (!googleConfigured()) return back(request, "google-not-configured");

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const jar = await cookies();
  const expectedState = jar.get(OAUTH_STATE_COOKIE)?.value;
  jar.delete(OAUTH_STATE_COOKIE);

  if (url.searchParams.get("error")) return back(request, "google-denied");
  if (!code || !state || !expectedState || state !== expectedState) {
    return back(request, "state-mismatch");
  }

  try {
    const { accessToken } = await exchangeCode(code, url.origin);
    const profile = await fetchProfile(accessToken);
    if (!profile.emailVerified) return back(request, "email-unverified");

    const domain = allowedDomain();
    if (domain && !profile.email.endsWith(`@${domain}`)) {
      return back(request, "wrong-domain");
    }

    const user = await adapters.users.getByEmail(profile.email);
    if (!user || !user.active) return back(request, "no-account");

    await createSession(user.id);
    await adapters.audit.append({
      actor: user.email,
      action: "auth.signIn",
      entity: "user",
      entityId: user.id,
      summary: `${user.email} signed in with Google.`,
    });
    return Response.redirect(new URL("/overview", request.url), 302);
  } catch (error) {
    console.error("[auth] Google callback failed", error);
    return back(request, "google-failed");
  }
}
