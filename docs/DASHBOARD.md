# Operations dashboard (`satco-admin/`)

**Scope since 2026-10-07:** the dashboard manages runtime data only.

| Area | What it does | Who sees it |
|---|---|---|
| Overview | Counts for open roles, new applications, and new inquiries per inbox | everyone (only their own inboxes) |
| Careers | Jobs (create / publish / pause / close), applications with CVs, general applications | per-user grant "Jobs & applications"; `admin` |
| Inquiries | One page per contact-form inquiry type: Discuss partnerships, Opportunities, Procurement, Careers, General inquiries | per-user grant per inbox; `admin` sees all |
| Users & access | Staff list, role, inbox grants, active flag, audit log | `admin` |

**Page copy is edited in code.** Every site string lives in `satco-web/content/generated/*.json`
(B and C copy A's files on `predev`/`prebuild`). Change the JSON, run `npm run build:web`, deploy.
There is no content editor, media library, feature-flag screen, publish center or Neon
content table any more. The retired code is archived outside the repo at
`D:\satco-dev\retired-cms-2026-10-07\` in case anything needs to be recovered.

## Roles and per-page access

- `staff` — only the pages granted on their account: **Jobs & applications** and/or any of
  the five inquiry inboxes (six checkboxes under Users & access).
- `admin` — everything, every page, Users & access, audit log, job deletion.

Grants are stored per user (`users.access`, a JSON array of `"jobs"` and inquiry types) and
checked server-side on every page (`requireCapability("manageJobs")` for Careers,
`requireInbox` for an inbox) and on every write. Helpers live in `@satco/shared`
(`canAccessPage`, `canAccessInbox`, `userCan`).

## Sign-in

Google OAuth, implemented in `lib/auth/google.ts` with no auth library. Google only
proves the email; the staff list decides who gets in. Setup is free:

1. Google Cloud console → APIs & Services → Credentials → **Create OAuth client ID** →
   Web application. Authorised redirect URIs:
   `https://<dashboard-domain>/api/auth/google/callback` and
   `http://localhost:3100/api/auth/google/callback`.
2. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET` (`openssl rand -base64 32`)
   and optionally `AUTH_ALLOWED_DOMAIN=satco.sa` in the dashboard's env (Vercel project
   settings in production, `.env.local` locally).
3. Add each person under **Users & access** with the email of their Google account.

Without Google credentials the login page shows demo accounts from the user store.
That mock mode is refused in production unless `ALLOW_MOCK_AUTH=true` is set on purpose.
**During the design phase (from 2026-10-07) the live dashboard runs with
`ALLOW_MOCK_AUTH=true`, so anyone with the URL can pick any account, including admin.
Remove that variable and configure Google before real inquiries or applications arrive.**
The session is a signed httpOnly cookie holding only the user id (`lib/auth/session.ts`);
role and page access are re-read from the store on every request, so changes apply at once.

## Contact form → inquiries

All three sites post the contact form to `POST /api/public/inquiries` on the dashboard
(`satco-web/lib/inquiries.ts` derives the URL from `NEXT_PUBLIC_CAREERS_API_URL`, falling
back to `localhost:3100` in dev). The endpoint checks the origin against
`PUBLIC_SITE_ORIGINS` (localhost 3000/3001/3002 always allowed), rate-limits per IP,
drops honeypot submissions, validates with `newInquirySchema`, stores the inquiry in its
inbox, audits it, and emails the department.

**Rate limit (both public POST endpoints, `lib/public-api.ts`):** 5 *accepted* submissions
per client IP per 10 minutes. Only stored records count — a validation error, a honeypot
hit or a server error never locks a visitor (or an office behind one IP) out. Hits are
rows in `public_rate_hits` on the Neon backend, so the limit holds across Vercel
instances; under the local backend, or if that table is unreachable, an in-memory map is
used and a warning is logged.

**Department email (optional, free):** set `RESEND_API_KEY` and `NOTIFY_FROM` (a sender on
a domain verified in Resend), then one recipient list per type
(`INQUIRY_NOTIFY_PROCUREMENT=procurement@satco.sa`, …) with `INQUIRY_NOTIFY_DEFAULT` as the
fallback. With no key the inquiry is still stored and shown; only the email is skipped.

## Database

`db/schema.sql` is the full schema for a fresh database (`npm run db:migrate`, then
`npm run db:seed` for demo rows). A database created **before 2026-10-07** must also run
`db/migrations/2026-10-07-operations-dashboard.sql` once (`npm run db:migrate` applies
schema.sql and then every file in `db/migrations/`): it maps the old roles to
staff/admin (former publishers keep the Jobs page), adds `users.access`, and drops the
`content_bundle` and `publishes` tables. Applied to the hosted Neon database on 2026-10-07.
`db/migrations/2026-10-07-public-rate-hits.sql` adds the `public_rate_hits` table for the
durable rate limit (see above); **not yet applied to hosted Neon** — run `npm run db:migrate`
once. Until then the endpoints log a warning per request and fall back to the in-memory limit.

## Environment

See `satco-admin/.env.example`. Deploy hooks for Careers (`VERCEL_DEPLOY_HOOK_URL`) stay:
publishing a job still rebuilds the static Careers pages.
