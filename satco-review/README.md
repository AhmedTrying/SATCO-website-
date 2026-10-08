# SATCO A / B / C review board

A one-screen meeting tool for choosing the combined website. It walks the deliberate
differences between Option A (`satco-web`), B (`satco-web-b`) and C (`satco-web-c`)
one section at a time, shows the **real sites** in frames, and records each reviewer's
opinion, the agreed decision and notes per section. Nothing is sent anywhere: state
lives in the presenter's browser and is exported as JSON / Markdown at the end.

Plain HTML/CSS/JS — no build, no dependencies.

| File | What |
|---|---|
| `index.html`, `styles.css`, `app.js` | the board |
| `items.js` | **the comparison list** — edit this to add, remove or reword sections |
| `serve.mjs` | zero-dependency local server (`node satco-review/serve.mjs`) |
| `vercel.json` | `noindex` + `no-store` for the hosted copy |

## Where it runs

- **Hosted:** `https://satco-review.vercel.app` (Vercel project `satco-review`, root directory
  `satco-review`, framework "Other"). Frames `https://satco-website-{a,b,c}.vercel.app`.
  The three sites allow that one origin to frame them on their `*.vercel.app` hosts only
  (`vercel.json` → `Content-Security-Policy: frame-ancestors 'self' https://satco-review.vercel.app`);
  the final `satco.sa` domain stays un-framable.
- **Local:** run the three sites (`npm run dev:web`, `dev:web-b`, `dev:web-c`) and
  `node satco-review/serve.mjs` → `http://localhost:3200` (or `preview_start satco-review`
  in Claude). On localhost the board frames `:3000 / :3001 / :3002` automatically.
- Ad-hoc origins: `?a=https://…&b=…&c=…` on the board URL.

## In the meeting

1. Open the board, press **F** (focus) to hide the rail and the option notes.
2. Walk the sections with **← →**. For each one:
   - **1 / 2 / 3** flips between A, B and C in place (all three are loaded, so flipping is instant and each keeps its own scroll position).
   - **S** shows all three side by side as real desktop layouts, scaled to fit. **M** switches to phone frames.
   - **R** reloads all three — use it on motion items (intro, hero) to replay. The sites replay the intro when loaded with `?intro=1`, which item 1 does.
   - Hover and scroll **inside** a frame work as on the real site (dropdowns, sliders, map switches).
   - "Open ↗" on a frame label opens that option in a new tab if a frame ever refuses to load.
3. Click each reviewer's chip as they speak (cycles A → B → C → none), click the **Decision**
   (A / B / C / Mix / Defer) and type **Notes** (for Mix: "B layout with C's photos"). Everything autosaves.
4. **Esc** shows the summary table; **Export Markdown** gives a table to paste into
   `docs/VARIANTS.md` as "Round 2 decisions"; **Export JSON** is the full backup (re-importable on any laptop).

Shortcuts are ignored while typing in the notes box. If keys stop working after clicking
inside a frame, click anywhere on the board chrome.

## Before the meeting

- Deploy the latest A/B/C and open the hosted board once in the meeting-room browser (state is per browser).
- Item 17 (careers list): B's "Show more" and C's pages only appear with **11+ live roles** in the
  dashboard feed. Add demo jobs in the dashboard or expect all three to look alike.
- Check the sites allow framing: `curl -I https://satco-website-a.vercel.app/` should show
  `content-security-policy: frame-ancestors 'self' https://satco-review.vercel.app` and no `x-frame-options`.
- Set the reviewers (top bar → Reviewers) if they differ from Bandar / Tamer / Tarek.
- Browser zoom at 100%; a 1920×1080 screen fits three side-by-side frames at ~0.4 scale.

## After the meeting

Paste the Markdown export into `docs/VARIANTS.md` and keep the JSON in `Feedbacks/`
(not committed). The decision table is the spec for building the combined site.

## Editing the list

`items.js` has one entry per difference. `id` is the storage key (don't rename after a
meeting), `path` can be a string or `{ A, B, C }`, `differs` is one line per option,
`hint` tells the presenter what to hover/scroll, `motion: true` opens the item in single
view with a replay hint. Hash targets on the home page (`#stat-h`, `#who-h`, `#sectors-h`,
`#contact-teaser-h`) sit below the sticky header via `scroll-margin-top` in each site's `globals.css`.
