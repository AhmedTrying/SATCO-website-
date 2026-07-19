-- SATCO admin dashboard — Neon Postgres schema.
--
-- The drop-in Postgres backend for the local file adapters. Every table mirrors a
-- shape in @satco/shared (cms.ts / content.ts); the Neon adapters in
-- satco-admin/lib/adapters/neon/ read and write these tables through the same
-- interfaces the UI already uses. Idempotent — safe to re-run (CREATE ... IF NOT
-- EXISTS). Apply with `npm run db:migrate` (from satco-admin) or `npm run -w satco-admin db:migrate`.
--
-- Note: a `seq bigserial` tiebreaker column preserves seed/insert order in list()
-- queries where several seed rows share an identical created_at timestamp
-- (ordering is `<time> DESC, seq ASC` → genuinely-newer rows first, seed order kept).

-- Content bundle -------------------------------------------------------------
-- The whole ContentBundle stored as one JSONB payload per status. The ContentStore
-- interface deals in whole bundles (getDraft/saveDraft/getPublished), so at most two
-- rows ever live here: 'draft' (editable) and 'published' (the live snapshot).
create table if not exists content_bundle (
  status      text primary key check (status in ('draft', 'published')),
  data        jsonb        not null,
  updated_at  timestamptz  not null default now(),
  updated_by  text
);

-- Staff accounts -------------------------------------------------------------
-- Backs MockAuth today (cookie session + role switcher). Real auth (Supabase/M365
-- SSO) can adopt this same table later; profiles.role maps to `role`.
create table if not exists users (
  seq         bigserial,
  id          text primary key,
  name        text        not null,
  email       text        not null unique,
  role        text        not null check (role in ('viewer', 'editor', 'publisher', 'admin')),
  active      boolean      not null default true,
  created_at  timestamptz  not null default now()
);

-- Jobs -----------------------------------------------------------------------
-- The site's Job shape + lifecycle metadata (state/createdAt/updatedAt).
create table if not exists jobs (
  seq               bigserial,
  id                text primary key,
  slug              text        not null unique,
  title             text        not null,
  location          text        not null,
  sector            text        not null,
  discipline        text        not null,
  experience_level  text        not null,
  type              text,
  posted_at         timestamptz,
  summary           text        not null,
  responsibilities  jsonb       not null default '[]'::jsonb,
  requirements      jsonb       not null default '[]'::jsonb,
  apply_href        text        not null,
  source            text        not null,
  state             text        not null check (state in ('draft', 'open', 'closed')),
  created_at        timestamptz  not null default now(),
  updated_at        timestamptz  not null default now()
);

-- Contact submissions --------------------------------------------------------
create table if not exists contact_submissions (
  seq            bigserial,
  id             text primary key,
  name           text        not null,
  email          text        not null,
  organization   text,
  inquiry_type   text        not null,
  message        text        not null,
  assigned_dept  text        not null,
  status         text        not null check (status in ('new', 'in-progress', 'handled', 'archived')),
  assignee       text,
  created_at     timestamptz  not null default now()
);

-- Job applications -----------------------------------------------------------
create table if not exists job_applications (
  seq             bigserial,
  id              text primary key,
  job_id          text        not null,
  job_title       text        not null,
  applicant_name  text        not null,
  email           text        not null,
  phone           text,
  cv_media_id     text,
  cover_note      text,
  status          text        not null check (status in ('new', 'reviewing', 'shortlisted', 'rejected', 'hired')),
  created_at      timestamptz  not null default now()
);

-- General (speculative) applications -----------------------------------------
create table if not exists general_applications (
  seq             bigserial,
  id              text primary key,
  applicant_name  text        not null,
  email           text        not null,
  phone           text,
  discipline      text,
  sector          text,
  cv_media_id     text,
  note            text,
  status          text        not null check (status in ('new', 'reviewing', 'archived')),
  created_at      timestamptz  not null default now()
);

-- Media index ----------------------------------------------------------------
-- The index rows. File bytes live under public/uploads locally (private/public
-- buckets → object storage later). Alt text is required for public-media (a11y),
-- enforced in the adapter.
create table if not exists media (
  seq          bigserial,
  id           text primary key,
  path         text        not null,
  filename     text        not null,
  alt          text        not null,
  bucket       text        not null check (bucket in ('public-media', 'private-uploads')),
  mime_type    text        not null,
  size_bytes   bigint       not null default 0,
  width        integer,
  height       integer,
  category     text,
  uploaded_at  timestamptz  not null default now(),
  uploaded_by  text        not null
);

-- Audit log (append-only) ----------------------------------------------------
create table if not exists audit_log (
  seq        bigserial,
  id         text primary key,
  ts         timestamptz  not null default now(),
  actor      text        not null,
  action     text        not null,
  entity     text        not null,
  entity_id  text,
  summary    text        not null,
  diff       jsonb
);

-- Publish history ------------------------------------------------------------
create table if not exists publishes (
  seq           bigserial,
  id            text primary key,
  published_at  timestamptz  not null default now(),
  published_by  text        not null,
  summary       text        not null,
  changed_keys  jsonb        not null default '[]'::jsonb
);

-- Helpful ordering indexes (small tables, but future-proof) ------------------
create index if not exists jobs_created_idx                 on jobs (created_at desc, seq asc);
create index if not exists contact_submissions_created_idx  on contact_submissions (created_at desc, seq asc);
create index if not exists job_applications_created_idx      on job_applications (created_at desc, seq asc);
create index if not exists general_applications_created_idx  on general_applications (created_at desc, seq asc);
create index if not exists media_uploaded_idx                on media (uploaded_at desc, seq asc);
create index if not exists audit_log_ts_idx                  on audit_log (ts desc, seq asc);
create index if not exists publishes_published_idx           on publishes (published_at desc, seq asc);
