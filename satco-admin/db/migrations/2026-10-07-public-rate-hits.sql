-- 2026-10-07: durable rate limit for the public endpoints (lib/public-api.ts).
-- Fresh databases get this from schema.sql; existing ones apply it here.
-- Idempotent — safe to re-run.

create table if not exists public_rate_hits (
  seq     bigserial    primary key,
  bucket  text         not null,
  client  text         not null,
  at      timestamptz  not null default now()
);
create index if not exists public_rate_hits_lookup_idx on public_rate_hits (bucket, client, at desc);
