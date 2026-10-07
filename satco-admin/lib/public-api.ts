/*
 * Shared plumbing for the public (unauthenticated) endpoints the sites call:
 * CORS against the allowed site origins and a rate limit per client IP.
 *
 * Rate limiting is split in two so that only ACCEPTED submissions count:
 *   - rateLimitExceeded()   — read-only check, run before the body is parsed;
 *   - recordAcceptedSubmission() — called after the record is stored.
 * Validation failures, honeypot hits and server errors therefore never lock a
 * visitor out (a shared office IP would otherwise be blocked by five typos).
 *
 * Hits live in Neon (`public_rate_hits`, see db/schema.sql) when the Neon backend
 * is active, so the limit survives Vercel spinning up a fresh instance. Under the
 * local backend, or if the table is unreachable, an in-memory map is used instead.
 */

import { query } from "@/lib/db";

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

// Rate limiting ---------------------------------------------------------------

export interface RateLimit {
  max: number;
  windowMs: number;
}

/** The client key: first hop of X-Forwarded-For (Vercel sets it), else X-Real-IP. */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}

type MemoryBuckets = Map<string, Map<string, number[]>>;
const memory = globalThis as typeof globalThis & { satcoPublicRateLimits?: MemoryBuckets };

function memoryBucket(bucket: string): Map<string, number[]> {
  const all: MemoryBuckets =
    memory.satcoPublicRateLimits ?? (memory.satcoPublicRateLimits = new Map());
  const limits = all.get(bucket) ?? new Map<string, number[]>();
  all.set(bucket, limits);
  return limits;
}

function memoryCount(bucket: string, client: string, windowMs: number): number {
  const limits = memoryBucket(bucket);
  const now = Date.now();
  const recent = (limits.get(client) ?? []).filter((time) => now - time < windowMs);
  limits.set(client, recent);
  return recent.length;
}

function memoryRecord(bucket: string, client: string): void {
  const limits = memoryBucket(bucket);
  limits.set(client, [...(limits.get(client) ?? []), Date.now()]);
}

function durableStore(): boolean {
  return process.env.DATA_BACKEND === "neon" && Boolean(process.env.DATABASE_URL);
}

async function durableCount(bucket: string, client: string, windowMs: number): Promise<number> {
  const rows = await query<{ hits: string | number }>(
    `select count(*)::int as hits from public_rate_hits
     where bucket = $1 and client = $2 and at > now() - ($3::int * interval '1 millisecond')`,
    [bucket, client, windowMs],
  );
  return Number(rows[0]?.hits ?? 0);
}

async function durableRecord(bucket: string, client: string, windowMs: number): Promise<void> {
  await query(`insert into public_rate_hits (bucket, client) values ($1, $2)`, [bucket, client]);
  // Keep the table tiny: rows older than the window are never read again.
  await query(
    `delete from public_rate_hits where bucket = $1 and at <= now() - ($2::int * interval '1 millisecond')`,
    [bucket, windowMs],
  );
}

/**
 * True when `request`'s client already has `max` ACCEPTED submissions to
 * `bucket` inside `windowMs`. Does not record anything.
 */
export async function rateLimitExceeded(
  request: Request,
  bucket: string,
  { max, windowMs }: RateLimit,
): Promise<boolean> {
  const client = clientKey(request);
  if (durableStore()) {
    try {
      return (await durableCount(bucket, client, windowMs)) >= max;
    } catch (error) {
      console.warn(`[public-api] rate-limit store unavailable for "${bucket}"; using memory.`, error);
    }
  }
  return memoryCount(bucket, client, windowMs) >= max;
}

/** Record one accepted submission to `bucket` for `request`'s client. */
export async function recordAcceptedSubmission(
  request: Request,
  bucket: string,
  { windowMs }: RateLimit,
): Promise<void> {
  const client = clientKey(request);
  if (durableStore()) {
    try {
      await durableRecord(bucket, client, windowMs);
      return;
    } catch (error) {
      console.warn(`[public-api] rate-limit store unavailable for "${bucket}"; using memory.`, error);
    }
  }
  memoryRecord(bucket, client);
}
