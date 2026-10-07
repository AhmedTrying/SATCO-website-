# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Corporate website for SATCO (Saudi Arabian Trading & Construction Co.) **plus its control dashboard**, built phase-by-phase against a client-approved spec. The repo is an **npm workspace** (one root lockfile):

- `satco-web/` — the public site (Next.js static export) = **Option A (original)**.
- `satco-web-b/`, `satco-web-c/` — **Options B and C**: copies of A for the client's per-option detail edits (ports 3001/3002, content shared with A). **Read `docs/VARIANTS.md` before editing any site**: every edit must name its option, and every difference from A goes in its change log.
- `satco-admin/` — the operations dashboard: careers, inquiry inboxes, users (Next.js App Router server app — **not** static export; runs on `:3100`). See `docs/DASHBOARD.md`.
- `packages/shared/` — `@satco/shared`: the content-model types (moved from `satco-web/lib/types.ts`), page-copy + CMS types, zod schemas (`@satco/shared/schemas`). Consumed as TS source via `transpilePackages`. Both apps and the Neon schema (`satco-admin/db/schema.sql`) agree on these shapes.
- `docs/DASHBOARD.md` — the dashboard's scope, roles, Google sign-in, inquiries endpoint and Neon migration. `docs/NEON-SWAP.md` / `docs/SUPABASE-SWAP.md` are the earlier backend plans, kept for history (their content-publishing parts no longer apply).

Everything else at the repo root is **source material, not code**:

- `SATCO-Phase0-Build-Plan.md` — the approved spec (routes, tokens §3, content model §5, components §6, motion §7, RTL §8, a11y §9, roadmap §10, **§13 = binding client decisions**).
- `SATCO.dc.html` + `support.js` + `img/` — the approved interactive design imported from claude.ai/design. Open it directly in a browser to see the visual truth.
- `Resources/New Web Copy.docx` — approved copy, **verbatim source for all wording** (20 tracked comments in `word/comments.xml` carry binding decisions; Word may lock the file — copy before parsing).
- `Images/` — client photography.

**Source-of-truth precedence:** design file = visual truth · plan = architecture truth · docx = copy truth. Where design and plan conflict, ask the user — do not silently pick. Locked client decisions (no login/"My SATCO" tab, loading-screen spec, Clients-page rules, careers detail pages, stat #3 has no number) override the design.

## Commands

Run from the repo root:

```bash
npm install                          # ONE root install (hoists to the store — see quirks)
npm run dev:web                      # Option A site dev on :3000 (prefer preview_start "satco-web")
npm run dev:web-b / dev:web-c        # Options B/C on :3001 / :3002 (preview_start "satco-web-b" / "satco-web-c")
npm run dev:admin                    # dashboard dev on :3100 (prefer preview_start "satco-admin")
npm run build:web                    # static export → satco-web/out/ (build:web-b / build:web-c for B/C)
npm run sync:variants                # copy A's content/generated JSON into B and C
npm run build:admin                  # dashboard production build
npm --workspace satco-web run typecheck    # tsc --noEmit (per app)
npm --workspace satco-admin run typecheck
npm --workspace satco-web run lint         # ESLint (per app; also lint:admin)
npm run db:migrate / db:seed         # apply satco-admin/db/schema.sql / load data/seed/*.json into Neon
```

There are no tests yet.

**Dashboard ↔ site (since 2026-10-07):** page copy is edited directly in `satco-web/content/generated/*.json` (the `content/*.ts` loaders re-export those slices; B and C copy A's files on `predev`/`prebuild`). The dashboard no longer publishes content — it only holds runtime data (jobs, applications, inquiries, users). Jobs still reach the static site through the public jobs API at build time (`scripts/fetch-content.mts`) and an optional Careers deploy hook.

## Critical environment quirks

> **Machine update (2026-09-25):** the repo now lives at `D:\Desktop\My projects\SATCO Website`, synced by **Google Drive** (not OneDrive). Root `node_modules` is currently a real folder (not a junction), and the old store is at `D:\satco-dev\satco-dev\satco-store`. `next.config.ts` uses `turbopack.root: "D:\\"` on win32. Git is installed per-user (`%LOCALAPPDATA%\Programs\Git`). Verify Node is on PATH before running anything. The notes below describe the older OneDrive/C: layout; adapt paths accordingly.

- **This folder is OneDrive-synced.** All `node_modules`/`.next` are **NTFS junctions** into `C:\satco-dev\` so OneDrive never syncs them. The store must stay OUTSIDE the user profile: the Claude desktop MSIX container virtualizes AppData/profile writes per-process, which splits a profile-located store into divergent copies and produces impossible build errors. `C:\satco-dev` is visible identically to every process.
- **Workspace junction layout (important):** deps hoist to ONE root `node_modules` → junction → `C:\satco-dev\satco-store\node_modules`. Each app's `.next` is junctioned to a **sibling of that node_modules** under the same store: `satco-web/.next` → `C:\satco-dev\satco-store\web-next`, `satco-admin/.next` → `C:\satco-dev\satco-store\admin-next`. **Why siblings:** Turbopack resolves PostCSS/Tailwind and other build tooling by `require()` from the compiled chunk's location inside `.next`; that walk only finds `node_modules` if it sits in an ancestor dir. If `.next` and `node_modules` live in different store folders, you get `Cannot find module '@tailwindcss/postcss'`. (`C:\satco-dev\satco-web-store` from the pre-workspace layout is orphaned — safe to delete.)
- **`npm install` DELETES the root `node_modules` junction** (warns `reify Removing non-directory`) and writes a real dir inside OneDrive. Recovery recipe: `Move-Item` the freshly-installed tree into `C:\satco-dev\satco-store\node_modules` (same-volume rename, instant), then re-`New-Item -ItemType Junction`. To detach a junction WITHOUT deleting its target, use `[System.IO.Directory]::Delete(path,$false)` (removes only the reparse point) — never `Remove-Item -Recurse` on a junction.
- Both `next.config.ts` set `turbopack.root: "C:\\"` — removing it breaks the build ("symlink points out of the filesystem root").
- Never run `next build` for an app while its own `next dev` is up (shared `.next`); different apps have separate `.next` so web-build + admin-dev is fine. Never `rm -rf .next` while that app's server is running.
- `satco-web/AGENTS.md` warns that this Next.js version (16.x) may differ from training data — check `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Architecture

- **Static export**: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. No server runtime — nothing may depend on request-time APIs. Compare paths with `isActivePath()` (`lib/utils.ts`), never `===` (trailing slashes).
- **Content is data, not JSX**: every user-facing string lives in typed `content/*.ts`, which re-export from `content/generated/*.json` (edited in code and committed); shapes live in `@satco/shared` (re-exported by `lib/types.ts`). Components import copy; no words hard-coded in JSX. Transcribe docx copy verbatim (em-dashes, "as well as" phrasing included). `content/jobs.ts` stays a mock (jobs are runtime data, not in the content bundle). Feature flags read from `content/flags.ts` (`generated/flags.json`), edited in code like the rest.
- **Tokens**: `styles/tokens.css` holds raw brand tokens (`--bronze-*`, `--stone-*`, semantic aliases, motion, `--nav-h`); the `@theme` blocks in `app/globals.css` map them into Tailwind v4 (CSS-first config — there is **no** `tailwind.config.ts`). Tailwind's default palette is disabled (`--color-*: initial`); only bronze/stone/semantic colors exist. Custom breakpoint `nav:` = 820px (desktop-nav collapse, from the design).
- **RTL seam**: logical properties/utilities only (`start-`/`end-`/`ps-`/`pe-`; v4's `px-`/`mx-` are already logical). Where no logical form exists (transforms, `origin-*`), pair with an `rtl:` variant or `[dir="rtl"]` override. `<html dir="ltr">` is the flip point; do not build Arabic now.
- **Nav chrome**: `.nav-chrome` (globals.css) swaps colors via CSS variables — transparent over the home hero, solid (`data-solid`) after 60px scroll or off-home. The home hero pulls itself under the sticky nav with `-mt-[var(--nav-h)]`.
- **A11y invariants**: WCAG 2.1 AA. Dropdowns use the **disclosure pattern** (button[aria-expanded] + list of links — deliberately *not* the design's `role="menu"`). Focus ring is solid bronze; dark containers add the `on-dark` class to switch the ring to bronze-300 (≥3:1). `RouteFocus` moves focus to `main h1` on client navigation. Reduced motion: global CSS clamp + `MotionConfig reducedMotion="user"`.
- **Phased build — stop at each phase boundary for client review.** P1 shell is done; P2 Home (incl. locked loading screen), P3 About, P4 Sectors, P5 Careers, P6 Contact, P7 polish. Reserved-but-unbuilt routes: `/vendors`, `/projects` (hooks only, never surfaced).
- **Known placeholder data** (never invent values): stat #3 figure, leadership content, client list/logos, contact details (`content/site.ts` carries design-prototype placeholders flagged with TODO), job feed source.

## Dashboard (`satco-admin/`)

**Simplified 2026-10-07 — see `docs/DASHBOARD.md`.** The dashboard manages runtime data only: **Careers** (jobs, applications, CVs), **Inquiries** (one page per contact-form inquiry type, each with its own per-user access grant) and **Users & access**. Page copy is edited in code (`content/generated/*.json`); there is no content editor, media library, feature-flag screen or publish center any more (retired code archived at `D:\satco-dev\retired-cms-2026-10-07\`).

- **Not static export** — App Router server app with server actions, reusing the site's bronze/stone tokens. Everything hosted sits behind typed **adapter interfaces** (`lib/adapters/types.ts`: `users`, `jobs`, `submissions`, `media` (CVs only), `audit`) with two impls — **local** (`lib/adapters/local/`, JSON files) and **Neon** (`lib/adapters/neon/`, Postgres) — selected by `DATA_BACKEND` in `lib/adapters/index.ts`.
- **Local stores** live in `satco-admin/data/`: committed `seed/*.json` + gitignored runtime `store/*.json` (write-through; reads fall back to seed). CVs go to gitignored `data/private-uploads/` locally, Vercel Blob in production.
- **Auth is real:** Google sign-in (`lib/auth/google.ts`, no library) + a signed session cookie (`lib/auth/session.ts`). Google proves the email; the `users` store decides who enters, with which role (`staff` | `admin`) and which pages (`users.access`: Jobs & applications and/or each inquiry inbox). Without Google credentials a demo account picker appears, never in production. Pages call `requireCapability()` / `requireInbox()` server-side (redirect to `/denied`); the sidebar is built per session by `lib/nav.ts`.
- **Public endpoints** (CORS against `PUBLIC_SITE_ORIGINS`, localhost 3000/3001/3002 always allowed, rate-limited, honeypot): `POST /api/public/inquiries` (contact form, all three sites), `POST /api/public/job-applications`, `GET /api/public/jobs`. New inquiries can email a department via Resend (`lib/notify.ts`, env-driven, optional).
- **Enforced locks (dashboard side):** apply URLs reject PDF/mailto; publishing a job needs `manageJobs`. The site-side locks (loading duration, stat #3, Selected Clients rules, verbatim copy) are now code-review rules on the JSON.
- **Neon:** `db/schema.sql` for fresh databases; existing ones also need `db/migrations/2026-10-07-operations-dashboard.sql` (roles mapped to staff/admin, `users.access`, content tables dropped); `npm run db:migrate` applies both. Hosted Neon migrated 2026-10-07. `db/migrations/2026-10-07-public-rate-hits.sql` (durable rate-limit table) applied to hosted Neon the same day.
- **Headers:** the three sites set security headers + `X-Robots-Tag: noindex` on `*.vercel.app` hosts in their `vercel.json` (`headers()` is ignored under static export); the dashboard sets the same (always noindex) in `next.config.ts`.
