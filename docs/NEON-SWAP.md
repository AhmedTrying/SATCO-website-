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
| `PublishService` | `local/publish-service.ts` | `publish-service.ts` | `publishes` + `content_bundle`; local development also writes `satco-web/content/generated/*.json` |

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
- [x] **Live content pipeline (dashboard → site) — WIRED.** `satco-web` has a **prebuild
      Neon fetch** (`scripts/fetch-content.mts`, run by the `prebuild` script) that pulls
      the published `content_bundle` → writes `content/generated/*.json` (shared
      `splitBundle` layout from `@satco/shared`; the committed JSON is the offline fallback
      if Neon is unreachable — the build never breaks). The Neon `PublishService` fires a
      **Vercel deploy hook** (`VERCEL_DEPLOY_HOOK_URL`) on publish. **To activate, set two
      things in Vercel on the `satco-website` project:** (1) a `DATABASE_URL` env var (so
      the build fetches from Neon), and (2) a **Deploy Hook** (Settings → Git → Deploy
      Hooks) whose URL goes in `satco-admin/.env.local` as `VERCEL_DEPLOY_HOOK_URL`. Then
      the loop is: dashboard edit → Publish → Neon updated + hook fired → Vercel rebuilds,
      fetching from Neon → live (~1–2 min). Note: JSONB doesn't preserve key order, so the
      fetched JSON is key-reordered vs the committed fallback (semantically identical — the
      loaders read by key). A deployed admin detects Vercel's read-only filesystem and
      skips the local `writeGeneratedContent` step, relying on this Neon + hook path.
- [x] **Careers build feed.** The site prebuild reads the dashboard's public jobs API
      into `content/generated/jobs.json`, which generates the listing, detail and
      application pages during the static build. On Vercel it falls back to
      `https://satco-dashboard.vercel.app/api/public/jobs` if no endpoint is set;
      Neon is a second fallback when `DATABASE_URL` is available. Publishing or
      closing a job triggers the site's Careers deploy hook (`CAREERS_DEPLOY_HOOK_URL`,
      falling back to `VERCEL_DEPLOY_HOOK_URL`). Check the site build log for
      `[fetch-content] wrote N published jobs to the build snapshot.` If both live
      sources fail on Vercel, the build fails instead of deploying stale jobs.
- [ ] **Public-site forms.** Role applications are now wired: the static site posts
      to the admin's `/api/public/job-applications` endpoint, which validates the open
      role, applies an origin check + honeypot + basic rate limit, stores the application
      in Neon, and indexes an optional CV. Set `NEXT_PUBLIC_CAREERS_API_URL` on the site
      and `PUBLIC_SITE_ORIGINS` on the deployed admin. The contact and general-application
      forms still need equivalent endpoints, production CAPTCHA, and routed notification
      email (Resend/SES).
- [x] **Careers runtime read.** The public Careers list fetches the dashboard's
      `/api/public/jobs` feed on load and when a visitor returns to the tab, then
      refreshes once a minute. Cards use `/careers/role?slug=…` and
      `/careers/role/apply?slug=…`, which read current details even for jobs posted
      after the last static build. Older static role URLs also load current details.
      The public feed hides roles whose application deadline has passed; a deadline
      remains open through its calendar date in Riyadh. Application POST enforces
      the same rule. The deploy hook remains useful for fresh HTML and SEO, while
      browser visitors see job changes without waiting for a rebuild.
- [x] **Private media** (CVs): the production dashboard stores new CVs in the
      private `satco-private-cvs` Vercel Blob store and streams them only through
      the role-gated download endpoint. Local development continues to use
      `satco-admin/data/private-uploads`. CVs uploaded before Blob was enabled
      cannot be recovered if their local file is gone; the dashboard now explains
      that they need to be uploaded again.
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
