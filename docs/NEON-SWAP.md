# Neon Postgres backend

The dashboard runs on **Vercel + Neon** (Postgres) instead of Supabase. Every hosted
service still sits behind a typed interface in `satco-admin/lib/adapters/types.ts`,
selected by `DATA_BACKEND` in `satco-admin/lib/adapters/index.ts`
(`local` = JSON files · `neon` = Postgres). Switching backends is an env flip — **no
screen or component changes**. This document tracks what's wired and what remains.

## What's wired (done)

- **Schema** — `satco-admin/db/schema.sql` (9 tables + ordering indexes), idempotent.
- **Driver** — `@neondatabase/serverless` (HTTP mode) in `satco-admin/lib/db.ts`;
  lazy client, so importing it under `DATA_BACKEND=local` is a no-op.
- **Adapters** — `satco-admin/lib/adapters/neon/` implements all seven interfaces.
- **Row mappers** — `neon/mappers.ts` normalises snake_case columns, `Date`
  timestamps → ISO strings, `bigint` → number, and `NULL` → `undefined`.
- **Seed** — `npm run db:seed` loads `data/seed/*.json` into Neon (idempotent).
- **Selection** — `DATA_BACKEND=neon` in `satco-admin/.env.local` picks the bundle.

### Interface → table map

| Interface | Local impl | Neon impl (`neon/…`) | Storage |
|---|---|---|---|
| `AuthProvider` | `local/auth.ts` | `auth.ts` | `users` table (cookie session + role switcher kept; a real IdP adopts `users.role` later) |
| `ContentStore` | `local/content-store.ts` | `content-store.ts` | `content_bundle` (JSONB rows: `draft`, `published`) |
| `MediaStore` | `local/media-store.ts` | `media-store.ts` | `media` index table; bytes still under `public/uploads` |
| `JobStore` | `local/job-store.ts` | `job-store.ts` | `jobs` table |
| `SubmissionStore` | `local/submission-store.ts` | `submission-store.ts` | `contact_submissions`, `job_applications`, `general_applications` |
| `AuditLog` | `local/audit-log.ts` | `audit-log.ts` | `audit_log` table |
| `PublishService` | `local/publish-service.ts` | `publish-service.ts` | `publishes` + `content_bundle`; still writes `satco-web/content/generated/*.json` |

## Setup / run

```bash
npm install                 # one root install (see the OneDrive/junction notes in CLAUDE.md)
npm run db:migrate          # apply db/schema.sql to Neon (idempotent)
npm run db:seed             # load data/seed/*.json into Neon (idempotent)
npm run dev:admin           # dashboard on :3100, now reading/writing Neon
```

`DATABASE_URL` is read from `satco-admin/.env.local` (template: `.env.example`). To
fall back to the offline JSON backend, set `DATA_BACKEND=local`.

**Reset a table:** `TRUNCATE <table>;` in the Neon SQL editor, then re-run `db:seed`
(seed inserts use `on conflict (id) do nothing`, so they never clobber dashboard edits).

## What remains (for full production)

The dashboard currently runs **locally** against Neon. To deploy the dashboard itself
and finish the site integration:

- [ ] **Deploy the admin** as a Vercel **server** app (its own project; root dir
      `satco-admin`; not the static-export project). Set `DATA_BACKEND` + `DATABASE_URL`
      in that project's env (the Vercel ↔ Neon integration can inject `DATABASE_URL`).
- [ ] **Publish path on serverless.** A deployed dashboard has a read-only FS, so
      `PublishService` can't write `satco-web/content/generated/*.json` in place. Switch
      to: publish flips the `content_bundle` published row → fires a **debounced deploy
      hook**; the site's build runs a **prebuild fetch** (`fetch-content`) that pulls the
      published bundle → writes the same per-section JSON (identical shape, `content/*.ts`
      loaders unchanged). Keep the committed snapshot as the offline fallback.
- [ ] **Public-site forms** (contact + applications): submit → `INSERT` into
      `contact_submissions` / `job_applications` / `general_applications`. On a static
      site this needs a small serverless endpoint (or the deployed admin) since Neon
      credentials can't ship to the browser. Add CAPTCHA (Turnstile/hCaptcha) + honeypot
      + per-IP rate limit + a routed notification email (Resend/SES).
- [ ] **Careers runtime read.** Site reads open jobs (`state = 'open'`); job-detail
      pages via `generateStaticParams` at build **plus** a client-rendered
      `/careers/role?id=…` fallback for jobs added after the last build.
- [ ] **Private media** (CVs): move `private-uploads` bytes off local disk to object
      storage (Vercel Blob / S3) with signed-URL access for publisher/admin; keep the
      required-alt-text rule for public media.
- [ ] **Least privilege.** Neon has no RLS; enforce access in the server layer
      (`requireCapability()` already gates routes). If public forms hit Postgres
      directly, use a **separate low-privilege Neon role** limited to `INSERT` on the
      submission tables. Keep the main `DATABASE_URL` server-only, never in a browser.
- [ ] **Auth.** Swap MockAuth's cookie for a real IdP (email/magic-link, then M365/Google
      SSO); `users.role` is already the source of truth, so `requireCapability()` /
      `roleCan()` and every call site stay the same. Drop the role switcher.
- [ ] **PDPL/GDPR.** Retention + deletion path for submissions/CVs; access limited to
      publisher/admin; confirm Neon region/DPA.
- [ ] **Backups/DR.** Verify the Neon plan's PITR/branching; the `content/generated`
      snapshot is already git-versioned.

## Security note

Neon credentials were shared in plaintext during setup and live only in the gitignored
`satco-admin/.env.local`. **Rotate the `neondb_owner` password** in the Neon console once
setup is confirmed, and update `.env.local` (and any Vercel env) with the new value.
