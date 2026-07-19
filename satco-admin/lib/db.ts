/*
 * Neon Postgres client — the data layer for the dashboard's Neon adapter bundle
 * (lib/adapters/neon/), selected by DATA_BACKEND=neon in lib/adapters/index.ts.
 *
 * Uses @neondatabase/serverless in HTTP mode: one HTTPS round-trip per query, with
 * no TCP pool to exhaust — the right fit for Next server actions on Vercel
 * serverless, and identical under local `next dev`. The client is created lazily so
 * that importing this module in DATA_BACKEND=local mode (no DATABASE_URL present) is
 * a harmless no-op. jsonb columns come back already parsed; timestamptz as a JS Date
 * and bigint as a string — the neon/mappers.ts row mappers normalise both.
 *
 * See docs/NEON-SWAP.md.
 */

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — the Neon backend (DATA_BACKEND=neon) requires it. " +
        "Add it to satco-admin/.env.local (see .env.example), or set DATA_BACKEND=local.",
    );
  }
  client = neon(url);
  return client;
}

/** Parameterised query → typed rows. jsonb columns come back already parsed. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return (await getClient().query(text, params)) as T[];
}

/** First row, or undefined when the result set is empty. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  return (await query<T>(text, params))[0];
}

/** Serialise a value for a jsonb parameter — pair with `$n::jsonb` in the SQL. */
export function jsonbParam(value: unknown): string {
  return JSON.stringify(value ?? null);
}
