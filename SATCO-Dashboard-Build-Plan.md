# SATCO Control Dashboard (CMS) — Build Plan

**What this is:** an authenticated admin dashboard that controls the content, media, features, careers, and contact flows of the SATCO corporate website (`satco-web/`).
**Status:** planning — for approval before any build.
**Locked decisions (from review):** (1) **Custom dashboard + Supabase**; (2) **full scope** — content, media, feature flags, Careers, Contact, users/roles; (3) **hybrid** publishing — marketing pages rebuild on publish, live data (jobs, submissions) read at runtime.
**Related docs:** `SATCO-Phase0-Build-Plan.md` (the public site's architecture, content model §5, locked client decisions §13).

---

## 1. Executive summary

The public site is a **static export** with content compiled into typed `content/*.ts` files — fast, cheap, and secure, but nothing about it changes without a developer and a rebuild. This project keeps that strength while giving SATCO non-technical control, by adding **two new things beside the existing site, not inside it**: a **Supabase backend** (Postgres + Auth + Storage) as the system of record, and a **separate authenticated dashboard app** (`satco-admin/`) where staff edit content, manage jobs, read contact submissions, flip feature flags, and manage each other's access.

The public site stays static. Content edits are drafted in the dashboard and, on **Publish**, snapshot into the site's build and trigger an automatic redeploy (~1–2 min) — so the marketing pages keep perfect SEO and performance. Only genuinely live data — the **jobs list** and **contact/careers form submissions** — talks to Supabase at **runtime** from the browser, guarded by row-level security. This is the "hybrid" model: static where it helps, live where it must be.

The result: SATCO owns all its data, pays no per-seat CMS fees, and gets an editing experience shaped exactly to the content model we already designed — while the public site remains the fast, resilient static export it is today.

---

## 2. System architecture

Three deployables plus one shared package:

```
┌──────────────────┐        edits/publish        ┌─────────────────────────┐
│  satco-admin/    │ ─────────────────────────▶  │  Supabase                │
│  (dashboard,     │ ◀─────────────────────────  │  • Postgres (content)    │
│   authenticated, │        reads (auth+RLS)     │  • Auth (staff logins)   │
│   NOT static)    │                             │  • Storage (logos, certs,│
└────────┬─────────┘                             │    photos, CVs)          │
         │ Publish → deploy hook                 │  • Edge Functions        │
         ▼                                       └─────────┬───────────────┘
┌──────────────────┐   build-time: fetch PUBLISHED content │ runtime: jobs list,
│  Host build      │ ◀─────────────────────────────────────┘ contact insert
│  (Vercel/Netlify)│                                         (anon key + RLS)
│  rebuilds        │                                              ▲
│  satco-web/      │                                              │
└────────┬─────────┘                                              │
         ▼ static export (HTML/CSS/JS)                            │
┌──────────────────────────────────────────────────────────────┴─┐
│  Public visitors  →  satco-web (static)  →  runtime reads for    │
│                                              jobs & form submit  │
└──────────────────────────────────────────────────────────────────┘
```

**Two data paths (the crux of "hybrid"):**
- **Build-time (content/SEO pages):** a prebuild step pulls **published** rows from Supabase and writes them into `satco-web/content/generated/*.json`, which the site imports exactly like today's `content/*.ts`. The public build never depends on a live DB at request time, the content snapshot is diff-able in git, and if Supabase is briefly unreachable at build the last snapshot still ships.
- **Runtime (live data only):** the jobs listing and the contact/careers forms use the Supabase **browser** client (anon key) against **RLS-restricted** views — jobs are read-only-published, submissions are insert-only. Nothing sensitive is exposed and the site stays static-exportable.

**Publish → rebuild:** the dashboard's Publish action (a) flips row status to `published`, (b) writes an audit entry, (c) calls a Supabase Edge Function that POSTs the host **deploy hook** — **debounced** (collect rapid edits into one build) so ten quick edits don't trigger ten deploys.

**Environments:** three Supabase environments via **Supabase branching** — `dev`, `staging`, `prod` — plus preview deploys of the dashboard. Migrations flow dev → staging → prod.

---

## 3. Data model (Supabase Postgres)

Content tables mirror the public site's content model (`Sector`, `Capability`, `Stat`, `Certification`, `Client`, `Job`, `LeadershipMember` from Phase 0 §5); the rest are CMS infrastructure. Every content row carries `status` (`draft` | `published`), `published_at`, `updated_at`, `updated_by`, and `sort_order`.

| Table | Purpose | Public read? |
|---|---|---|
| `site_settings` | Singleton: tagline, contact details, socials, disclaimer text | published only (build-time) |
| `feature_flags` | Toggles & tunables (see §8) | published only |
| `stats` | 6 homepage stats (value nullable — stat #3) | published only |
| `sectors` | 4 sectors: names, taglines, overview, mobile_summary, why | published only |
| `capabilities` | Sector core-capability blocks (FK → sectors) | published only |
| `sector_delivery` | Delivery models per sector | published only |
| `sector_experience` | Selected Experience (+ `pending` flag = the go/no-go) | published only |
| `company_info` | About long-form blocks | published only |
| `certifications` | ISO/LEED + `image_media_id` (cert scans) | published only |
| `classifications`, `licenses` | Gov classifications, GACAR Part 151 | published only |
| `clients` | `tier` = `selected`\|`directory`, `logo_media_id`, sector[], geography | published only |
| `leadership` | Key People (name, title, bio, photo) | published only |
| `jobs` | Postings: slug, sector, discipline, level, summary, responsibilities[], requirements[], apply_href, `state` = draft\|open\|closed | **runtime read** (open only) |
| `job_applications` | Applications incl. `cv_media_id` (private) | insert-only |
| `general_applications` | "Submit your profile" | insert-only |
| `contact_submissions` | inquiry_type, message, routing, `status`, `assigned_dept` | insert-only |
| `media` | Storage index: path, alt, width/height, bucket, uploaded_by | public rows readable |
| `profiles` | Staff accounts ↔ auth users, `role` | self + admins |
| `audit_log` | actor, action, entity, entity_id, diff (jsonb), ts | admins/publishers |

**Storage buckets:** `public-media` (logos, certificate images, photography — public read) · `private-uploads` (CVs, application files — **private**, signed-URL access for publisher/admin only).

**Types:** generate TypeScript types from the schema (`generate_typescript_types`) into the shared package so both apps are type-safe against the real database.

---

## 4. Auth, roles & permissions

**Auth:** Supabase Auth for staff. Launch with email + password or magic link; **corporate SSO** (Microsoft 365 / Google Workspace — SATCO likely has M365) recommended as a fast follow (§16 Q).

**Roles** (`profiles.role`), enforced by **row-level security on every table** via a `SECURITY DEFINER` `auth_role()` helper:

| Capability | Viewer | Editor | Publisher | Admin |
|---|:--:|:--:|:--:|:--:|
| See dashboard & drafts | ✅ | ✅ | ✅ | ✅ |
| Create/edit drafts, upload media | | ✅ | ✅ | ✅ |
| **Publish** (+ trigger rebuild) | | | ✅ | ✅ |
| Open/close jobs, triage submissions | | | ✅ | ✅ |
| Download CVs (private bucket) | | | ✅ | ✅ |
| Manage users, roles, settings, flags | | | | ✅ |
| Delete content / destructive actions | | | | ✅ |

**Public (anon key) is deliberately tiny:** `SELECT` only on published-jobs view; `INSERT` only on `contact_submissions` / applications (no read-back); nothing else. The **service-role key lives only in the dashboard's server actions** (never shipped to a browser). Every privileged write goes through a server action, is validated with zod against the shared types, and is written to `audit_log`.

**Spam protection** on public forms: a CAPTCHA (Cloudflare Turnstile / hCaptcha), a honeypot field, and per-IP rate limiting via an Edge Function.

---

## 5. Dashboard information architecture

`satco-admin/` — an authenticated Next.js app (App Router, **not** static export; it needs server actions + auth). Reuses the SATCO design tokens so it feels on-brand, but denser and utilitarian.

- **Overview** — recent submissions, open jobs, "unpublished changes since last deploy," rebuild status, quick actions.
- **Content**
  - *Homepage* — hero slides, the 6 stats (stat #3 value left blank until provided), Who We Are, teasers.
  - *Sectors* — list → per-sector editor: overview, **capabilities repeater**, delivery models, Selected Experience (with the **pending go/no-go** toggle), Why SATCO, mobile summary, hero image.
  - *About* — Company Information (long-form), **Leadership** (people CRUD), **Certifications** (classifications, licenses, ISO/LEED + certificate images), **Clients** (Selected Clients logo set + A–Z directory + disclaimer).
  - *Site settings* — tagline, contact details, socials.
- **Media library** — upload, set **alt text** (required — a11y), replace, browse by bucket; grayscale preview for client logos.
- **Careers** — Jobs CRUD (draft → open → closed), plus the **applications inbox** (with private CV download).
- **Contact** — **submissions inbox**: filter by inquiry type / department / status, assign, mark handled, export CSV.
- **Features & settings** — the flag catalog (§8) with human-readable labels and safe controls.
- **Users & roles** — invite, set role, deactivate; **audit log** viewer.
- **Publish center** — a diff of what changed since the last deploy, **Preview** (renders draft content), and the **Publish / rebuild** button with live deploy status.

Editing discipline: most fields are plain text/textarea to preserve the **verbatim-copy** rule (em-dashes, "as well as" phrasing) — only Company Information gets a light rich-text/markdown editor. Validation mirrors `lib/types.ts` so the dashboard can't produce shapes the site can't render.

---

## 6. Public-site integration (the hybrid seam)

Changes to `satco-web/` are **additive and small**:
- **Content source swap:** `content/*.ts` becomes a thin loader that imports `content/generated/*.json` (produced by the prebuild fetch). Same types, same import sites — components don't change. A committed snapshot means the site still builds if the DB is momentarily down.
- **Prebuild step:** `npm run fetch-content` (runs before `next build`) pulls published rows → writes JSON. Runs in CI on every deploy, triggered by the deploy hook.
- **Jobs (runtime):** the Careers list fetches `jobs` (state = open) from Supabase in the browser. **Job-detail pages resolve the Phase 0 static-export tension:** pre-render detail pages for all jobs published at build time (`generateStaticParams`), **plus** a client-rendered fallback (`/careers/role?id=…`) for jobs added after the last build — so new roles are live immediately and existing roles keep clean, SEO-friendly URLs.
- **Contact/careers forms (runtime):** submit via anon client → `INSERT` into `contact_submissions` / applications → an Edge Function emails the routed department and (for CVs) stores the file in the private bucket.
- **Feature flags:** flags that affect **layout/SEO** (section visibility, vendor tab, pending-experience) are read at **build time** (baked in). Flags that are **operational** (e.g., a maintenance banner) can be read at runtime. Default is build-time to keep pages static.

Still **fixed** for the public site: `output: 'export'`, `images.unoptimized`, WCAG 2.1 AA, RTL-ready, no server runtime. The dashboard is the only server-side app.

---

## 7. Tech stack & repository structure

Convert the repo into a lightweight **workspace** (npm/pnpm workspaces):

```
satco/
├─ satco-web/            # existing public site (static export) — minimal additions
├─ satco-admin/          # NEW dashboard: Next.js App Router (server actions), NOT export
├─ packages/shared/      # NEW: shared TS types (lib/types.ts moves here),
│                        #      zod schemas, Supabase client factories, generated DB types
├─ supabase/             # NEW: migrations, seed, RLS policies, Edge Functions
└─ *.md                  # plans & source material at root
```

- **Dashboard:** Next.js (App Router) + TypeScript (strict), `@supabase/ssr` for cookie-based auth, **server actions/route handlers** for privileged writes (service role server-only), `react-hook-form` + `zod`, TanStack Table for inboxes, Supabase Storage uploads. Deployed with a server runtime (Vercel/Netlify functions).
- **Shared:** one source of truth for types — the site, the dashboard, and the DB all agree. `lib/types.ts` relocates here; Supabase-generated types layer on top.
- **Supabase:** migrations in `supabase/migrations` (applied via the Supabase MCP / CLI), RLS policies as code, Edge Functions (`trigger-rebuild`, `notify-submission`, `rate-limit`).
- ⚠ **Dev-environment carry-over** (from the site's build notes): this folder is OneDrive-synced — keep every app's `node_modules`/`.next` **out of OneDrive** (junctions to a non-synced path) to avoid the sync/lock failures already documented for `satco-web`.

---

## 8. Feature-flags & settings catalog

Concrete toggles the dashboard exposes (seed values from the current build):

| Flag | Type | Controls | Read at |
|---|---|---|---|
| `loading_duration_ms` | number (1200 default) | Loading-screen total time — settles the 1.2 vs 1.5/2/3s debate live | build |
| `show_review_control` | bool (off) | The review-only timing switcher | build |
| `show_vendor_tab` | bool (off) | Activates the reserved `/vendors` nav slot | build |
| `show_pending_experience` | bool | The Construction/Operations/PPP "Selected Experience" go/no-go | build |
| `section_visibility.*` | bool per homepage/section | Show/hide optional sections | build |
| `careers_source` | enum (`dashboard`\|`linkedin`\|`ats`) | Where jobs come from (see §9) | build/runtime |
| `maintenance_banner` | text/null | Optional sitewide notice | runtime |

Flags are typed and validated; changing a build-time flag queues a rebuild like any content edit.

---

## 9. Careers & Contact backends

**Careers** — decide the **system of record** (Q in §16): now that the dashboard exists, jobs can live **in Supabase** (dashboard = source of truth), or continue from a **LinkedIn/ATS feed** with the dashboard as a mirror/override. Recommended: **dashboard as source of truth**, with an optional Edge-Function importer that ingests a LinkedIn/ATS feed into the same `jobs` table (dedupe by external id) — one model, both inputs. Applications (incl. CV upload to the private bucket) land in the **applications inbox**; **no PDF-only or email-only workflow** (per locked comment #42); apply button posts to the chosen destination.

**Contact** — submissions insert into `contact_submissions` with the **inquiry-type → department routing** from comment #22 (partnerships/opportunities → Info + BD, procurement → Info + Procurement, careers → HR, general → Info). An Edge Function emails the routed department (via Resend/SES) and the inbox lets staff triage, assign, mark handled, and export. This finally closes Phase 0 open questions Q8 (form backend) and Q16 (routing) — pending the actual department addresses.

---

## 10. Tooling, skills & connectors

- **Supabase MCP (available now)** — provision the project, apply migrations, generate types, create a dev **branch**, inspect logs/advisors. I can scaffold schema + RLS through it.
- **Skills:** `supabase` and `supabase-postgres-best-practices` (schema/RLS/perf), `design:design-system` (keep the admin on-brand), `design:accessibility-review` (the dashboard is AA too), `verify`/`run` (drive both apps), `code-review` each phase.
- **Deploy hook** — from the host (Vercel/Netlify): the rebuild trigger. **Needs the hosting decision** (Q13 from Phase 0).
- **Email** — a transactional provider (Resend/SES/SendGrid) + a verified sending domain for submission notifications.
- No new interactive-auth connectors are required; Supabase is already wired to this project.

---

## 11. Build roadmap

Each phase is independently deployable and review-gated.

| Phase | Scope | Depends on |
|---|---|---|
| **D0 (now)** | This plan → approval. Decisions locked. | — |
| **D1 Foundation** | Supabase project + **schema + RLS + Storage buckets**, generated types, `packages/shared`, dashboard scaffold + **Auth + roles** + protected shell, **seed script from existing `content/*.ts`**. | Supabase, hosting choice |
| **D2 Content management** | Homepage, Sectors, About (Company/Leadership/Certs/Clients), Site settings, **Media library**; draft/publish + audit. | D1 |
| **D3 Public integration (hybrid)** | Prebuild content fetch → `content/generated`, content-source swap in `satco-web`, **deploy hook + debounced rebuild**, Publish center + **Preview**. | D1–D2, hosting |
| **D4 Careers backend** | Jobs CRUD, runtime jobs read, **static + fallback** job details, applications inbox + private CV storage. | D1–D3 |
| **D5 Contact backend** | Submissions insert, inbox + routing, **notification emails**, spam protection. | D1–D3, email provider |
| **D6 Flags & settings** | Wire the flag catalog (§8) to the site (loading timing, vendor tab, visibility, pending-experience, review control). | D2–D3 |
| **D7 Users/roles/audit + hardening** | Invite flow, role management, audit-log UI, security review, **PDPL/retention**, backups, runbook/docs. | all |

**Parallelism:** D4 and D5 are independent of each other; content entry can proceed as soon as D2 lands.

---

## 12. Security, privacy & operations

- **RLS on every table**, service role server-only, least-privilege anon. Storage: public bucket for public assets, **private bucket for CVs/PII** with signed URLs.
- **Personal data (PDPL + GDPR):** contact submissions and CVs are personal data. Define a **retention period**, deletion path, access limited to publisher/admin, and a DPA with Supabase. Choose a **data-residency region** deliberately (Q).
- **Audit log** on every privileged mutation for accountability.
- **Backups/DR:** Supabase automated backups (verify tier); periodic export of the content snapshot (already in git via `content/generated`).
- **Environments:** dev/staging/prod via Supabase branching; migrations promoted forward; no editing straight against prod.
- **Secrets:** service-role key, deploy-hook URL, email API key, captcha secret — all in server/Edge env only.

---

## 13. Open questions / assumptions

1. ⚠ **Hosting** (also Phase 0 Q13) — Vercel / Netlify / Azure Static Web Apps? Determines the **deploy-hook** and where the dashboard's server runtime lives. *Blocks D1/D3.*
2. ⚠ **Careers system of record** — dashboard as source of truth, or keep a **LinkedIn/ATS feed** (and which ATS)? *Assumption: dashboard is source of truth, optional feed importer.* (D4)
3. ⚠ **Department email addresses** for contact routing (Info, BD, Procurement, HR) — from comment #22. *Blocks D5 notifications.*
4. **Email provider** + verified sending domain (Resend/SES/SendGrid). (D5)
5. **Auth method** — email/password or magic link at launch; **M365/Google SSO** when? *Assumption: magic link first, SSO fast-follow.* (D1)
6. **Roles in practice** — who edits what (Marketing, BD, HR, IT)? Maps to the role matrix and routing. (D1/D7)
7. **Data residency / PDPL** — Supabase region and CV/PII **retention period**; DPA needed. (D1/D7)
8. **Preview strategy** — in-dashboard preview vs a preview deployment of `satco-web` reading draft content. *Assumption: in-dashboard preview + optional preview deploy.* (D3)
9. **Localization seam** — Arabic is a future site phase; add nullable `locale`/translations columns now so the CMS is bilingual-ready without rework? *Recommended: yes, schema-only.* (D1)
10. **Domains** — an `admin.satco.sa` subdomain for the dashboard. (D1)
11. **Approvals** — is a formal editor→publisher approval step wanted, or is role-gating enough? *Assumption: role-gating + audit; add approvals in D7 if needed.*

---

## Ready to build — approve to proceed to D1?

Approving unlocks **D1 (Foundation):** the Supabase project, schema + RLS + storage, the shared types package, and the dashboard shell with login and roles — seeded from the content already in `satco-web`. To start cleanly I need **(1) the hosting/deploy target** (Q1) and, when convenient, **the Careers source-of-record decision** (Q2) and **department emails** (Q3) so D4–D5 aren't blocked. Everything else can proceed on the assumptions above.
