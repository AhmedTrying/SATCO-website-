-- 2026-10-07 — dashboard simplified to Careers + Inquiries + Users, with
-- per-user page access ("jobs" and/or each inquiry inbox).
--
-- Applied by `npm run db:migrate` after db/schema.sql. Plain DDL/DML only;
-- every statement is safe to re-run.
--
-- 1. Per-user page grants.
alter table users add column if not exists access jsonb not null default '[]'::jsonb;

-- 2. Roles: viewer/editor/publisher/admin (and the short-lived recruiter) → staff/admin.
--    Former publishers / recruiters ran careers, so they keep the Jobs page.
alter table users drop constraint if exists users_role_check;
update users set access = access || '["jobs"]'::jsonb
  where role in ('publisher', 'recruiter') and not (access ? 'jobs');
update users set role = 'staff' where role in ('viewer', 'editor', 'publisher', 'recruiter');
alter table users add constraint users_role_check check (role in ('staff', 'admin'));

-- 3. A transitional column from an unreleased build, if present.
alter table users drop column if exists inboxes;

-- 4. Page copy is edited in code now; the publish pipeline is gone.
drop table if exists content_bundle;
drop table if exists publishes;

-- 5. The media index now holds private CVs only; public images live in the
--    sites' public/ folders. Remove index rows that pointed at site images.
delete from media where bucket = 'public-media';
