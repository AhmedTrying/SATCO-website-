# SATCO control dashboard — build kickoff (Supabase deferred)

## 0. Scope — read this first
Build the **SATCO control dashboard** (`satco-admin/`) and **link it to the existing website** (`satco-web/`).

**Supabase is deferred to a later stage. Do NOT set up Supabase, Auth, Storage, RLS, Edge Functions, or any hosted backend now.** Instead, build the **full dashboard UI** and wire it to the site through **typed data-adapter seams** with **local/mock implementations**. Every place a hosted backend will eventually go must sit behind an interface so that swapping in Supabase later is a drop-in, not a rewrite — exactly how `satco-web` already handles the Careers feed behind a typed seam.

The interim link is real: the dashboard's **Publish** writes the site's content JSON and the site renders from it. Later, that local file-store implementation is replaced by the Supabase build-time fetch — no UI changes.

## 1. Read these before writing any code
- `SATCO-Dashboard-Build-Plan.md` — the approved dashboard plan: data model (§3), roles (§4), **dashboard screens (§5)**, hybrid link (§6), repo/workspace (§7), **feature-flag catalog (§8)**, roadmap. *Where this prompt and the plan agree, follow the plan; the plan's Supabase specifics are the "later" target, not now.*
- `SATCO-Phase0-Build-Plan.md` — the site's content model (§5) and **§13 locked client decisions** (these constrain what the dashboard may edit and how).
- `satco-web/` — the built site: `lib/types.ts` (the shapes), `content/*.ts` (the real content to seed from), `styles/tokens.css` + the Tailwind config (brand tokens to reuse), `CLAUDE.md`.

## 2. What "link it to the website" means at this stage
1. **Shared types (the primary link).** Move `satco-web/lib/types.ts` into `packages/shared` and have **both** apps import from there. The site, the dashboard, and (later) the database all agree on one set of types. Add `zod` schemas beside them for runtime validation in the dashboard.
2. **Content-generation seam (the working link).** Refactor `satco-web` so `content/*.ts` reads from `content/generated/*.json` (same types, same import sites — components don't change; keep a committed JSON snapshot as a fallback so the site still builds if the files are missing). The dashboard's **Publish** writes those JSON files. Result: edit in the dashboard → Publish → `npm run build` in `satco-web` → change is live. This is the local stand-in for the plan's build-time Supabase fetch.
3. ⚠ Treat the `satco-web` content-loader refactor carefully — the site is already built and verified. Keep the typed shape identical, make it reversible, and **verify the site renders byte-for-byte the same** from generated JSON before moving on.

## 3. Architecture — everything hosted sits behind an adapter (`satco-admin/lib/adapters/`)
Define these interfaces once; ship a **local implementation** now and a documented **`// TODO(supabase)`** seam for later. Select the implementation by env: `DATA_BACKEND=local` now → `supabase` later.

| Interface | Now (local impl) | Later (Supabase) |
|---|---|---|
| `AuthProvider` | `MockAuth` — dev login + a **role switcher** (viewer/editor/publisher/admin) to preview permissions | Supabase Auth |
| `ContentStore` | file-based drafts; **Publish writes `satco-web/content/generated/*.json`** | Postgres + build-time fetch |
| `MediaStore` | local uploads to a repo media dir + a JSON index; **required alt text** | Storage (public + private buckets) |
| `JobStore` | file-based jobs CRUD, seeded from the site's Job mock | `jobs` table (+ optional feed importer) |
| `SubmissionStore` | seeded mock submissions/applications; status editable locally | insert-from-site + inbox reads |
| `AuditLog` | append to a local file | `audit_log` table |
| `PublishService` | write generated JSON; rebuild = manual `npm run build` | status flip + debounced deploy hook |

Role-based UI gating (per the §4 matrix: viewer/editor/publisher/admin) is **built now** against `MockAuth`, so it's ready the moment real auth lands.

## 4. Tech stack & repo
Convert the repo into a workspace (npm or pnpm workspaces):
```
satco/
├─ satco-web/          # existing site — only the content-loader change (§2.2) + import paths
├─ satco-admin/        # NEW dashboard: Next.js App Router + TypeScript (strict). NOT static export.
├─ packages/shared/    # NEW: types (moved from satco-web/lib/types.ts) + zod schemas + adapter interfaces
└─ *.md                # plans at root
```
- Dashboard: Next.js (App Router), `react-hook-form` + `zod`, a table component for inboxes, local file I/O via route handlers/server actions (Node `fs`) for the local stores. **No secrets, no hosted services yet.**
- **Reuse the site's brand tokens** (bronze/stone) so the admin is on-brand; the admin may be denser/more utilitarian and have its own components.
- The dashboard is **not** a static export (it's interactive and will need server actions later) — run it as a normal Next.js dev app.

## 5. Setup notes
- `git init` is already done for the repo; keep the workspace tidy with one lockfile.
- ⚠ **OneDrive:** this folder is synced and the workspace now has **multiple** `node_modules`. Keep every `node_modules`/`.next` **out of OneDrive** (junctions to a non-synced path) — the site's build notes document why (sync storms, file locks, "impossible" build errors).
- Do not modify `satco-web` beyond §2 (types move + content-loader). Don't touch its locked behaviours.

## 6. Non-negotiables carried from the site (the dashboard must respect and enforce these)
- **Verbatim copy discipline:** content fields are plain text/textarea (preserve em-dashes, "as well as", the U+2019 apostrophes). Only Company Information gets light rich-text. The dashboard must not auto-"improve" wording.
- **Never invent content:** stat #3 ("Residential & Community Assets Delivered") value stays **blank/optional** until provided.
- **Locked values become the seed defaults of the feature-flag editor:** `loading_duration_ms=1200`, `show_review_control=off`, `show_vendor_tab=off`, `show_pending_experience` (the Construction/Operations/PPP go/no-go), section visibility, plus the loading-screen spec is not editable into something that violates the lock (fade-only, ≤1.5s cap on the picker).
- **Clients editor enforces the rules:** "Selected Clients" logos are **grayscale, unlinked, max 30**; plus the searchable A–Z **directory**; plus the verbatim disclaimer.
- **Careers editor matches the site's Job shape:** every job has summary / responsibilities / requirements / location / apply; **no PDF or email-only** apply; tone rules (no "family"/"rockstars").
- **Accessibility AA + keyboard + responsive apply to the dashboard too.**

## 7. Dashboard screens (from plan §5)
Overview · Content (Homepage, Sectors incl. capabilities repeater + experience toggle, About: Company/Leadership/Certifications/Clients, Site settings) · Media library · Careers (Jobs CRUD + applications inbox) · Contact (submissions inbox + department routing) · Features & settings (the flag catalog) · Users & roles + audit log · **Publish center** (diff since last publish, preview, Publish → writes generated JSON).

## 8. Build order — stop at each phase boundary for review
- **DA1 Foundation:** workspace + `packages/shared` (move types, add zod), scaffold `satco-admin` (App Router, brand tokens), app shell (sidebar + top bar), `AuthProvider`/`MockAuth` + role switcher + route gating, **all adapter interfaces with local impls**, seed local stores from `satco-web/content`. **Deliverable: navigable dashboard shell with stub login, role gating, and empty screens.**
- **DA2 Content management:** editors for Homepage, Sectors, About (Company, Leadership CRUD, Certifications, Clients selected+directory+disclaimer), Site settings; zod validation; draft state; Media library with local upload + alt text.
- **DA3 Link to site:** the §2 content-loader refactor in `satco-web`; `ContentStore` Publish writes `content/generated/*.json`; **verify end-to-end** — edit → Publish → `satco-web` rebuild shows the change, site output otherwise unchanged.
- **DA4 Careers:** Jobs CRUD (draft/open/closed) + applications inbox (mock data), matching the site's Job model; document the live-feed/Supabase seam.
- **DA5 Contact:** submissions inbox with the comment-#22 department routing, filters, assign, export (mock data); document the Supabase + email seam.
- **DA6 Flags & settings:** wire the flag catalog so toggling actually changes the site build (flags written into the generated content/config the site reads).
- **DA7 Users/roles/audit + polish:** user management + role assignment (local), audit-log viewer, a11y pass, responsive, and a **"Supabase swap" checklist** enumerating every adapter to implement later.

**Start with DA1 only. Do not run ahead.**

## 9. Deferred — do NOT build now (this is the "later" list)
Supabase project, Postgres schema, RLS, Auth, Storage buckets, Edge Functions, the deploy-hook rebuild trigger, email notifications, real form ingestion, SSO, environments/branching. Each is represented **only** by its adapter interface + a `// TODO(supabase)` note now.

## 10. Verify before claiming done
Run both apps. For each phase: dashboard usable at 390/768/1280px, keyboard-only pass, no horizontal scroll. For **DA3 specifically**, prove the link: make an edit, Publish, rebuild `satco-web`, and show the change appearing on the site with everything else identical. Report what you verified vs assumed.

## 11. Start here
1. Read the plan + the site's types/content/tokens (§1).
2. Propose the **workspace layout + `packages/shared` move + the adapter interface signatures** and your **DA1 file list**.
3. Wait for approval before writing code.
