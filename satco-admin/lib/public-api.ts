/*
 * Shared plumbing for the public (unauthenticated) endpoints the sites call:
 * CORS against the allowed site origins and a small in-memory rate limit per
 * client IP. The careers application endpoint keeps its own copy of this logic
 * (it predates this file); new endpoints import from here.
 */

export function allowedOrigins(): Set<string> {
  const origins = new Set(
    (process.env.PUBLIC_SITE_ORIGINS ?? "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
  // The three site options run on :3000/:3001/:3002 locally while the dashboard
  // runs on :3100. Keep that first-party pairing available even under `next start`.
  for (const port of [3000, 3001, 3002]) {
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);
  }
  return origins;
}

export function originAllowed(origin: string | null): boolean {
  return !origin || allowedOrigins().has(origin);
}

export function corsHeaders(origin: string | null, methods = "POST, OPTIONS"): HeadersInit {
  if (!origin || !allowedOrigins().has(origin)) return { Vary: "Origin" };
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

export function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin: string | null,
): Response {
  return Response.json(body, { status, headers: corsHeaders(origin) });
}

type RateBuckets = Map<string, Map<string, number[]>>;
const buckets = globalThis as typeof globalThis & { satcoPublicRateLimits?: RateBuckets };

/** True when `request`'s client exceeded `max` calls to `bucket` within `windowMs`. */
export function isRateLimited(
  request: Request,
  bucket: string,
  { max, windowMs }: { max: number; windowMs: number },
): boolean {
  const all: RateBuckets =
    buckets.satcoPublicRateLimits ?? (buckets.satcoPublicRateLimits = new Map());
  const limits = all.get(bucket) ?? new Map<string, number[]>();
  all.set(bucket, limits);
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const recent = (limits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  limits.set(key, recent);
  return false;
}
