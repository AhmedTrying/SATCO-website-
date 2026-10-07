import { randomBytes } from "node:crypto";

import { cookies } from "next/headers";

import { authorizeUrl, googleConfigured, OAUTH_STATE_COOKIE } from "@/lib/auth/google";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Step 1 of Google sign-in: remember a random state and send the browser to Google. */
export async function GET(request: Request): Promise<Response> {
  if (!googleConfigured()) {
    return Response.redirect(new URL("/login?error=google-not-configured", request.url), 302);
  }
  const state = randomBytes(24).toString("base64url");
  const jar = await cookies();
  jar.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/api/auth/google",
    maxAge: 10 * 60,
  });
  return Response.redirect(authorizeUrl(new URL(request.url).origin, state), 302);
}
