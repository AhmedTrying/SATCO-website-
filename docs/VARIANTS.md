# SATCO site options — A / B / C

**Read this first in any chat or tool (Claude Code, Codex, other models) before editing the public site.**

The client wants to compare three versions of the public website. They are the same site
except for small, deliberate per-option details.

| Option | Folder | Package | Dev port | Run | Build |
|---|---|---|---|---|---|
| **A — original** | `satco-web/` | `satco-web` | 3000 | `npm run dev:web` | `npm run build:web` |
| **B** | `satco-web-b/` | `satco-web-b` | 3001 | `npm run dev:web-b` | `npm run build:web-b` |
| **C** | `satco-web-c/` | `satco-web-c` | 3002 | `npm run dev:web-c` | `npm run build:web-c` |

Claude desktop previews: `preview_start` with `satco-web`, `satco-web-b`, `satco-web-c` (see `.claude/launch.json`).
All three can run side by side (each has its own `.next`). The dashboard (`satco-admin`, :3100) is **shared**.

## Rules

1. **Know the target.** Every edit request must name its option (A, B, or C). If it doesn't, ask.
   Never "fix" A while working on B/C, or copy a B/C change into another option without being asked.
2. **Log every intentional difference** from A in the change log below (option, date, what, files).
   Anything that differs from A and isn't logged is drift, so treat it as a bug.
3. **Shared changes** (bug fixes, content-model changes, things all options need) go into A first,
   then get ported to B and C by hand. Note the port in the log.
4. **Content is shared.** B and C show A's content: copy, images, and flags from the dashboard bundle.
   `satco-web-{b,c}/scripts/sync-content-from-a.mts` copies `satco-web/content/generated/*.json`
   on `predev`/`prebuild` (or run `npm run sync:variants`). In production the Neon prebuild fetch
   overwrites them with the same published bundle. **Don't hand-edit `content/generated/*.json` in B/C.**
   If an option truly needs different *wording*, raise it with the user first, because that
   breaks the shared-content model.
5. `packages/shared` (`@satco/shared`) is used by all three sites + the dashboard. Changing it affects every option.
6. All repo-wide rules in `CLAUDE.md` / `AGENTS.md` (verbatim copy, a11y AA, RTL seam, locked client
   decisions, no invented placeholder data) apply to every option.

## Setup notes

- Created 2026-09-25 as byte-for-byte copies of `satco-web/` (minus `node_modules`, `.next`, `out`, `tsbuildinfo`).
  Only differences at creation: `package.json` (name, `-p` port, `predev`/`prebuild` sync step),
  the `AGENTS.md` option banner, and `scripts/sync-content-from-a.mts`.
- `satco-admin/app/api/public/job-applications/route.ts` allows local origins :3000, :3001, :3002,
  so the careers apply form works from every option in dev.
- **Deployment:** local only for now. When needed: one Vercel project per option (root dir
  `satco-web-b` / `satco-web-c`, same env as `satco-website`: `DATABASE_URL`,
  `NEXT_PUBLIC_CAREERS_API_URL`, `CAREERS_JOBS_API_URL`), add their domains to the dashboard's
  `PUBLIC_SITE_ORIGINS`, and add their deploy hooks if Publish should rebuild them too.

## Change log (differences from A)

| Date | Option | Change | Files |
|---|---|---|---|
| 2026-09-25 | B, C | Created as exact copies of A (no visual differences yet) | — |

## Status / next steps

- [ ] Receive the client's list of per-option edits (B and C).
- [ ] Install Node.js + Git on the dev machine, run `npm install`, and verify all three run (:3000/:3001/:3002).
- [ ] Commit the A/B/C setup.
- [ ] (Later) Vercel projects for B and C.
