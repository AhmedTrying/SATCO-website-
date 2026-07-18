# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Corporate website for SATCO (Saudi Arabian Trading & Construction Co.) **plus its control dashboard**, built phase-by-phase against a client-approved spec. The repo is an **npm workspace** (one root lockfile):

- `satco-web/` — the public site (Next.js static export).
- `satco-admin/` — the authenticated control dashboard (Next.js App Router server app — **not** static export; runs on `:3100`).
- `packages/shared/` — `@satco/shared`: the content-model types (moved from `satco-web/lib/types.ts`), page-copy + CMS types, zod schemas (`@satco/shared/schemas`). Consumed as TS source via `transpilePackages`. Both apps and (later) the Supabase schema agree on these shapes.
- `docs/SUPABASE-SWAP.md` — the checklist for replacing the dashboard's local adapters with Supabase.

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
npm run dev:web                      # site dev on :3000 (prefer preview_start "satco-web")
npm run dev:admin                    # dashboard dev on :3100 (prefer preview_start "satco-admin")
npm run build:web                    # static export → satco-web/out/
npm run build:admin                  # dashboard production build
npm --workspace satco-web run typecheck    # tsc --noEmit (per app)
npm --workspace satco-admin run typecheck
npm --workspace satco-web run lint         # ESLint (per app; also lint:admin)
npm run seed                         # regenerate satco-admin/data/seed/*.json from satco-web/content
```

There are no tests yet.

**Dashboard ↔ site link (DA3):** the dashboard's Publish writes `satco-web/content/generated/*.json` (per-section); `satco-web/content/*.ts` are thin loaders that re-export those JSON slices with the same names/types, so components are unchanged. A committed snapshot ships as the offline fallback. Edit in the dashboard → Publish → `npm run build:web` → live. Everything sits behind typed adapters in `satco-admin/lib/adapters/` (`DATA_BACKEND=local` now → `supabase` later; see `docs/SUPABASE-SWAP.md`). Verified: the loader refactor is byte-for-byte identical to the pre-refactor build.

## Critical environment quirks

- **This folder is OneDrive-synced.** All `node_modules`/`.next` are **NTFS junctions** into `C:\satco-dev\` so OneDrive never syncs them. The store must stay OUTSIDE the user profile: the Claude desktop MSIX container virtualizes AppData/profile writes per-process, which splits a profile-located store into divergent copies and produces impossible build errors. `C:\satco-dev` is visible identically to every process.
- **Workspace junction layout (important):** deps hoist to ONE root `node_modules` → junction → `C:\satco-dev\satco-store\node_modules`. Each app's `.next` is junctioned to a **sibling of that node_modules** under the same store: `satco-web/.next` → `C:\satco-dev\satco-store\web-next`, `satco-admin/.next` → `C:\satco-dev\satco-store\admin-next`. **Why siblings:** Turbopack resolves PostCSS/Tailwind and other build tooling by `require()` from the compiled chunk's location inside `.next`; that walk only finds `node_modules` if it sits in an ancestor dir. If `.next` and `node_modules` live in different store folders, you get `Cannot find module '@tailwindcss/postcss'`. (`C:\satco-dev\satco-web-store` from the pre-workspace layout is orphaned — safe to delete.)
- **`npm install` DELETES the root `node_modules` junction** (warns `reify Removing non-directory`) and writes a real dir inside OneDrive. Recovery recipe: `Move-Item` the freshly-installed tree into `C:\satco-dev\satco-store\node_modules` (same-volume rename, instant), then re-`New-Item -ItemType Junction`. To detach a junction WITHOUT deleting its target, use `[System.IO.Directory]::Delete(path,$false)` (removes only the reparse point) — never `Remove-Item -Recurse` on a junction.
- Both `next.config.ts` set `turbopack.root: "C:\\"` — removing it breaks the build ("symlink points out of the filesystem root").
- Never run `next build` for an app while its own `next dev` is up (shared `.next`); different apps have separate `.next` so web-build + admin-dev is fine. Never `rm -rf .next` while that app's server is running.
- `satco-web/AGENTS.md` warns that this Next.js version (16.x) may differ from training data — check `node_modules/next/dist/docs/` before using unfamiliar APIs.

## Architecture

- **Static export**: `output: 'export'`, `trailingSlash: true`, `images.unoptimized: true`. No server runtime — nothing may depend on request-time APIs. Compare paths with `isActivePath()` (`lib/utils.ts`), never `===` (trailing slashes).
- **Content is data, not JSX**: every user-facing string lives in typed `content/*.ts`, which now re-export from `content/generated/*.json` (published by the dashboard); shapes live in `@satco/shared` (re-exported by `lib/types.ts`). Components import copy; no words hard-coded in JSX. Transcribe docx copy verbatim (em-dashes, "as well as" phrasing included). `content/jobs.ts` stays a mock (jobs are runtime data, not in the content bundle). Feature flags read from `content/flags.ts` (`generated/flags.json`).
- **Tokens**: `styles/tokens.css` holds raw brand tokens (`--bronze-*`, `--stone-*`, semantic aliases, motion, `--nav-h`); the `@theme` blocks in `app/globals.css` map them into Tailwind v4 (CSS-first config — there is **no** `tailwind.config.ts`). Tailwind's default palette is disabled (`--color-*: initial`); only bronze/stone/semantic colors exist. Custom breakpoint `nav:` = 820px (desktop-nav collapse, from the design).
- **RTL seam**: logical properties/utilities only (`start-`/`end-`/`ps-`/`pe-`; v4's `px-`/`mx-` are already logical). Where no logical form exists (transforms, `origin-*`), pair with an `rtl:` variant or `[dir="rtl"]` override. `<html dir="ltr">` is the flip point; do not build Arabic now.
- **Nav chrome**: `.nav-chrome` (globals.css) swaps colors via CSS variables — transparent over the home hero, solid (`data-solid`) after 60px scroll or off-home. The home hero pulls itself under the sticky nav with `-mt-[var(--nav-h)]`.
- **A11y invariants**: WCAG 2.1 AA. Dropdowns use the **disclosure pattern** (button[aria-expanded] + list of links — deliberately *not* the design's `role="menu"`). Focus ring is solid bronze; dark containers add the `on-dark` class to switch the ring to bronze-300 (≥3:1). `RouteFocus` moves focus to `main h1` on client navigation. Reduced motion: global CSS clamp + `MotionConfig reducedMotion="user"`.
- **Phased build — stop at each phase boundary for client review.** P1 shell is done; P2 Home (incl. locked loading screen), P3 About, P4 Sectors, P5 Careers, P6 Contact, P7 polish. Reserved-but-unbuilt routes: `/vendors`, `/projects` (hooks only, never surfaced).
- **Known placeholder data** (never invent values): stat #3 figure, leadership content, client list/logos, contact details (`content/site.ts` carries design-prototype placeholders flagged with TODO), job feed source.

## Dashboard (`satco-admin/`)

- **Not static export** — App Router server app with server actions + local file I/O (Node `fs`), reusing the site's bronze/stone tokens (denser/utilitarian). Everything hosted sits behind typed **adapter interfaces** (`lib/adapters/types.ts`) with **local impls** (`lib/adapters/local/`), selected by `DATA_BACKEND` in `lib/adapters/index.ts`. Swapping to Supabase = implement each interface + flip the env; no screen changes. See `docs/SUPABASE-SWAP.md`.
- **Local stores** live in `satco-admin/data/`: committed `seed/*.json` (generated from `satco-web/content` via `npm run seed`) + gitignored runtime `store/*.json` (write-through; reads fall back to seed). Uploads go to gitignored `public/uploads/`.
- **Auth is mocked** (`MockAuth`, cookie session) with a **role switcher** in the top bar to preview viewer/editor/publisher/admin. Route gating is real: pages call `requireCapability()` server-side (redirects to `/denied`), and nav visibility is filtered by `roleCan()`. This all stays when Supabase Auth lands.
- **Publish** (`lib/adapters/local/publish-service.ts`) writes `satco-web/content/generated/*.json` via `splitBundle()` (the single source of truth for the per-section file layout — mirror it if you add content sections), snapshots draft→published, and audits. Rebuild is manual (`npm run build:web`).
- **Enforced locks** (do not weaken): loading duration cap ≤1500ms + fade-only; `loadingText` frozen; Selected Clients grayscale/unlinked/max-30; stat #3 stays null; apply URLs reject PDF/mailto; verbatim copy is never auto-transformed. AA applies here too (labels associated, focus rings, keyboard, no horizontal scroll at 375px).
