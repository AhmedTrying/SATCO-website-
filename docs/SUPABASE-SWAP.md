# Supabase swap checklist

The dashboard ships with **local file-backed adapters**. Every hosted service sits
behind a typed interface in `satco-admin/lib/adapters/types.ts`, selected by
`DATA_BACKEND` in `satco-admin/lib/adapters/index.ts` (`local` now → `supabase`
later). Swapping to Supabase means implementing each interface once and flipping
the env var — **no screen or component changes**.

## 0. Provision (once)

- [ ] Create the Supabase project (choose a **data-residency region** deliberately — PDPL, plan §12 Q7).
- [ ] Create dev / staging / prod via **Supabase branching**; migrations flow dev → staging → prod.
- [ ] Storage buckets: `public-media` (public read) and `private-uploads` (private, signed-URL only).
- [ ] Generate DB types (`generate_typescript_types`) into `packages/shared` and layer them on top of the hand-written types.

## 1. Adapters to implement (`satco-admin/lib/adapters/supabase/`)

Each mirrors a local impl under `satco-admin/lib/adapters/local/`:

| Interface | Local impl (now) | Supabase impl (later) |
|---|---|---|
| `AuthProvider` | `local/auth.ts` (cookie session + role switcher) | Supabase Auth (email/magic-link, then M365/Google SSO); `profiles.role`; **drop the role switcher** |
| `ContentStore` | `local/content-store.ts` (draft/published JSON) | content tables with `status`, `updated_by`, `sort_order`; draft vs published rows |
| `MediaStore` | `local/media-store.ts` (index + `public/uploads`) | Storage buckets; signed URLs for `private-uploads`; keep the **required-alt-text** enforcement |
| `JobStore` | `local/job-store.ts` (jobs JSON) | `jobs` table; optional Edge-Function feed importer (dedupe by external id) |
| `SubmissionStore` | `local/submission-store.ts` (seeded inbox JSON) | `contact_submissions` / `job_applications` / `general_applications`; insert-from-site (anon + RLS), inbox reads (publisher/admin) |
| `AuditLog` | `local/audit-log.ts` (append JSON) | `audit_log` table |
| `PublishService` | `local/publish-service.ts` (writes `content/generated/*.json`) | flip row status → published + fire a **debounced deploy hook**; keep writing the JSON snapshot for build-time fetch |

## 2. Public-site integration

- [ ] Replace the committed `satco-web/content/generated/*.json` producer: a **prebuild fetch** (`npm run fetch-content`) pulls *published* rows → writes the same per-section JSON (identical shape — the site's `content/*.ts` loaders don't change). Keep the committed snapshot as the offline fallback.
- [ ] Careers **runtime read**: the site fetches `jobs` (state = open) via the Supabase browser client + RLS. Job-detail pages: `generateStaticParams` for build-time jobs **plus** a client-rendered `/careers/role?id=…` fallback for jobs added after the last build (plan §6).
- [ ] Contact/careers **forms**: submit via anon client → `INSERT` (RLS insert-only, no read-back) → Edge Function emails the routed department and stores CVs in `private-uploads`.
- [ ] Feature flags: build-time flags (`section_visibility`, `show_review_control`, `loading_duration_ms`, `show_vendor_tab`, `show_pending_experience`) stay baked into `content/generated/flags.json`; `maintenance_banner` may move to a runtime read.

## 3. Security / RLS / ops (plan §4, §12)

- [ ] **RLS on every table** via a `SECURITY DEFINER` `auth_role()` helper; enforce the role matrix (viewer/editor/publisher/admin).
- [ ] Least-privilege anon: `SELECT` on published-jobs view only; `INSERT` on submissions/applications only.
- [ ] Service-role key **server-only** (dashboard server actions); never shipped to a browser.
- [ ] Spam protection on public forms: CAPTCHA (Turnstile/hCaptcha) + honeypot + per-IP rate limit (Edge Function).
- [ ] Email provider (Resend/SES) + verified sending domain; **department addresses** from comment #22 (plan §12 Q3 — pending).
- [ ] **PDPL/GDPR**: retention period + deletion path for submissions/CVs; access limited to publisher/admin; DPA with Supabase.
- [ ] Deploy hook from the host (Vercel/Netlify/Azure — plan §12 Q1, pending); debounce rapid edits into one build.
- [ ] Backups/DR (verify tier); the `content/generated` snapshot is already git-versioned.

## 4. Flip

- [ ] Set `DATA_BACKEND=supabase`; wire the `supabaseAdapters` bundle in `index.ts`.
- [ ] Delete `satco-admin/data/seed` reliance (seed the DB once from it instead).
- [ ] Remove the MockAuth role switcher from the top bar.

Nothing in `satco-admin/app/**` or `satco-web/**` should need to change — the seams are the contract.
