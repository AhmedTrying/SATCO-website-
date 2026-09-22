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
  job_reference     text,
  title             text        not null,
  department        text,
  location          text        not null,
  sector            text        not null,
  discipline        text        not null,
  experience_level  text        not null,
  type              text,
  number_of_vacancies integer,
  experience_required text,
  education         text,
  posted_at         timestamptz,
  application_deadline timestamptz,
  summary           text        not null,
  responsibilities  jsonb       not null default '[]'::jsonb,
  requirements      jsonb       not null default '[]'::jsonb,
  preferred_qualifications jsonb not null default '[]'::jsonb,
  screening_questions jsonb not null default '[]'::jsonb,
  hiring_manager    text,
  apply_href        text        not null,
  source            text        not null,
  state             text        not null check (state in ('draft', 'published', 'paused', 'closed', 'archived')),
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
  status         text        not null check (status in ('new', 'in-progress', 'responded', 'closed')),
  assignee       text,
  internal_note  text,
  created_at     timestamptz  not null default now(),
  updated_at     timestamptz  not null default now()
);

-- Job applications -----------------------------------------------------------
create table if not exists job_applications (
  seq             bigserial,
  id              text primary key,
  candidate_id    text,
  job_id          text        not null,
  job_title       text        not null,
  applicant_name  text        not null,
  email           text        not null,
  phone           text,
  current_city    text,
  country_of_residence text,
  current_job_title text,
  years_experience integer,
  qualification   text,
  specialization  text,
  current_employer text,
  linkedin_url    text,
  notice_period   text,
  work_authorization text,
  skills          jsonb       not null default '[]'::jsonb,
  application_source text,
  cv_media_id     text,
  cover_note      text,
  screening_answers jsonb not null default '[]'::jsonb,
  criteria_match  text,
  internal_notes  jsonb       not null default '[]'::jsonb,
  history         jsonb       not null default '[]'::jsonb,
  status          text        not null check (status in ('new', 'under-review', 'shortlisted', 'interview', 'final-review', 'offer', 'hired', 'rejected', 'withdrawn', 'talent-pool')),
  created_at      timestamptz  not null default now(),
  updated_at      timestamptz  not null default now()
);

-- Recruitment dashboard migration for existing Neon databases. The first three
-- statements normalize the former lifecycle values before the new constraints
-- are applied; the remaining statements are harmless on a fresh database.
alter table jobs add column if not exists job_reference text;
alter table jobs add column if not exists department text;
alter table jobs add column if not exists number_of_vacancies integer;
alter table jobs add column if not exists experience_required text;
alter table jobs add column if not exists education text;
alter table jobs add column if not exists application_deadline timestamptz;
alter table jobs add column if not exists preferred_qualifications jsonb not null default '[]'::jsonb;
alter table jobs add column if not exists screening_questions jsonb not null default '[]'::jsonb;
alter table jobs add column if not exists hiring_manager text;
alter table jobs drop constraint if exists jobs_state_check;
update jobs set state = 'published' where state = 'open';
alter table jobs add constraint jobs_state_check check (state in ('draft', 'published', 'paused', 'closed', 'archived'));

alter table contact_submissions add column if not exists internal_note text;
alter table contact_submissions add column if not exists updated_at timestamptz not null default now();
alter table contact_submissions drop constraint if exists contact_submissions_status_check;
update contact_submissions set status = 'responded' where status = 'handled';
update contact_submissions set status = 'closed' where status = 'archived';
alter table contact_submissions add constraint contact_submissions_status_check check (status in ('new', 'in-progress', 'responded', 'closed'));

alter table job_applications add column if not exists candidate_id text;
alter table job_applications add column if not exists current_city text;
alter table job_applications add column if not exists country_of_residence text;
alter table job_applications add column if not exists current_job_title text;
alter table job_applications add column if not exists years_experience integer;
alter table job_applications add column if not exists qualification text;
alter table job_applications add column if not exists specialization text;
alter table job_applications add column if not exists current_employer text;
alter table job_applications add column if not exists linkedin_url text;
alter table job_applications add column if not exists notice_period text;
alter table job_applications add column if not exists work_authorization text;
alter table job_applications add column if not exists skills jsonb not null default '[]'::jsonb;
alter table job_applications add column if not exists application_source text;
alter table job_applications add column if not exists screening_answers jsonb not null default '[]'::jsonb;
alter table job_applications add column if not exists criteria_match text;
alter table job_applications add column if not exists internal_notes jsonb not null default '[]'::jsonb;
alter table job_applications add column if not exists history jsonb not null default '[]'::jsonb;
alter table job_applications add column if not exists updated_at timestamptz not null default now();
alter table job_applications drop constraint if exists job_applications_status_check;
update job_applications set status = 'under-review' where status = 'reviewing';
alter table job_applications add constraint job_applications_status_check check (status in ('new', 'under-review', 'shortlisted', 'interview', 'final-review', 'offer', 'hired', 'rejected', 'withdrawn', 'talent-pool'));

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
