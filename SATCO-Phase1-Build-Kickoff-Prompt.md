# SATCO website — import the design, then build (Phase 1 kickoff)

## 0. First: import the design
Use the claude_design MCP (https://api.anthropic.com/v1/design/mcp, auth via /design-login) to import this project:
https://claude.ai/design/p/866902e1-cfc8-430b-ba7f-5fbfd9caa268?file=SATCO.dc.html

Implement: SATCO.dc.html

If the MCP isn't authorized yet, run `/design-login` first, then retry the import. Don't proceed past this step until the design file is actually downloaded into the repo — tell me if it fails rather than reconstructing it from memory.

## 1. Read these before writing any code
Everything you need is already in this folder. Read, in order:
- **`SATCO-Phase0-Build-Plan.md`** — the **approved spec**. Sitemap/routes, design tokens (§3), folder structure (§4), content model (§5), component inventory (§6), motion (§7), responsive + RTL (§8), accessibility (§9), build roadmap (§10), open questions (§12), and **§13 — the binding client decisions extracted from the Word comments**.
- **`SATCO-Interactive-Design-Prompt.md`** — the brief the imported design was built from.
- **`Resources/New Web Copy.docx`** — the approved copy, source of truth for all wording. Note: it has **20 tracked comments** in `word/comments.xml` (a separate part from `word/document.xml`) carrying binding decisions — §13 of the plan summarises them, but read them if you need detail. Word may hold a lock on the file; copy it before parsing.
- **`Images/`** — the provided photography (Airports, Construction, Neom, LS, Brochure Photos, Logo.jpg).

## 2. Source-of-truth precedence — do not guess
1. **The imported design (`SATCO.dc.html`) = visual truth**: layout, composition, spacing rhythm, component appearance.
2. **The plan = architecture truth**: routes, folder structure, content model, component boundaries, motion specs, accessibility, RTL, and the locked decisions.
3. **The .docx = copy truth**: verbatim. Never rewrite, embellish, or "improve" the wording.

Where the design and the plan **conflict, stop and ask me** — do not silently pick one. The locked items in §3 below override the design if it contradicts them.

## 3. Non-negotiables (locked by client sign-off — these override the design)
- **Loading screen:** 1.2s total (300ms fade in / 600ms hold / 300ms fade out), **fade only** — no curtain, clip, scale, or slide. Linear or ease-in-out only. White/very light off-white background, **no imagery, no gradients, no overlays**. Wordmark in the site family, **regular or medium weight (NOT bold)**, letter-spacing **+2–4%**, centred. Text is frozen: **"Celebrating over 50 years of excellence"**. Logo optional, small, monochrome, **above** the text — default to **text-only**. Shows **once per session**, never repeats on internal navigation, never blocks scrolling after fade-out. **prefers-reduced-motion: skip the animation entirely** and load the homepage directly.
- **No "My SATCO" / employee / login tab.** The site is consumer-facing; employees keep the existing Oracle login, decoupled. Reserve `/vendors` for future vendor registration but **do not surface it**.
- **Hero and Operating Sectors stay separate sections** — do not merge them.
- **Clients page:** label **"Selected Clients"** (never "All Clients"); 18–24 logos, **hard max 30**; grid **6 / 3 / 2**; **grayscale only**; **unlinked** (avoid endorsement optics); **no animation beyond a subtle fade-in**. Plus a **searchable, text-only A–Z directory** (2 cols desktop / 1 mobile, fast client-side search). Plus the disclaimer verbatim: "Client names and logos are the property of their respective owners and are used for identification purposes only. Their inclusion does not imply endorsement, sponsorship, or an ongoing relationship unless expressly stated."
- **Careers:** every job needs a **detail page** (role summary · responsibilities · requirements · location · apply button). **No PDFs, no email-only workflows.** Tone: no "family", no "rockstars", no exaggerated culture claims.
- **Stat #3** ("Residential & Community Assets Delivered — Buildings") has **no number yet — never invent one.** Render the label with a placeholder.

## 4. Tech stack (fixed — do not substitute)
Next.js **App Router** + TypeScript (strict) · **Tailwind with a custom token config** (disable the default palette — no colour leakage) · **Framer Motion** · **static-export compatible** (`output: 'export'`, no server runtime deps) · semantic HTML5 · **WCAG 2.1 AA**, fully keyboard navigable · **RTL-ready** (logical properties only — no physical `left`/`right`; keep the `dir` seam; English-first, **do not build Arabic now**) · mobile-first responsive.

## 5. Setup notes
- Scaffold the app into **`./satco-web/`**, keeping `Images/`, `Resources/`, and the `.md` docs at the repo root as source material.
- **`git init`** — this folder is not a repo yet. Add a sensible `.gitignore` (`node_modules`, `.next`, `out`).
- ⚠ **This folder is OneDrive-synced.** Exclude `node_modules/` and `.next/` from OneDrive sync (or develop from a non-synced path) — otherwise you'll hit sync storms and file locks.
- **Self-host fonts** via `next/font/local` with woff2 committed to the repo — no runtime Google Fonts request (keeps static export offline and CSP-clean).
- `next.config`: `output: 'export'`, `images.unoptimized: true`, `trailingSlash: true`.
- Run `/init` to generate a `CLAUDE.md` once the app is scaffolded.

## 6. Content is data, not JSX
All copy lives in typed **`content/*.ts`** files as the single source of truth (plan §5): `site`, `navigation`, `stats`, `sectors`, `company`, `certifications`, `clients`, `leadership`, `jobs`. Shared interfaces in `lib/types.ts`. Pages and components **import** copy — never hard-code strings in JSX. Transcribe the .docx verbatim, including the em-dashes and the "as well as" phrasing.

## 7. Build order — stop at each phase boundary for my review
- **P1 Foundation:** tokens (`styles/tokens.css` + `tailwind.config.ts`), self-hosted fonts, root layout, **Nav** (with the two dropdowns), **MobileNav**, **Footer**, `Container`/`Section`, `SkipLink`, motion provider + reduced-motion, and `content/site.ts` + `navigation.ts` + `lib/types.ts`. **Deliverable: a navigable shell** — real nav and footer, all routes present but empty.
- **P2 Home:** LoadingScreen (locked spec), Hero `SectorSlider`, `StatBand` count-up, WhoWeAre, SectorsOverview, Careers/Contact teasers, scroll reveal.
- **P3 About layer:** About L1, Company Information, Certifications (**with certificate images**), Clients (logo grid + searchable directory + disclaimer), Leadership (placeholder).
- **P4 Sectors:** L1 + four L2 pages, mobile summaries, disabled `/projects` link hook.
- **P5 Careers:** `Job` model, mock data, filters, cards, **detail pages**, How We Hire, General Application. Live LinkedIn/ATS feed = a clearly-marked TODO adapter seam in `lib/jobs.ts`.
- **P6 Contact:** form (+ the pending inquiry-type routing selector), details, map placeholder.
- **P7 Polish:** axe + keyboard a11y pass, perf, responsive images (`srcset`/`<picture>` — `images.unoptimized` means we pre-generate sizes), metadata/OG, `sitemap.xml`/`robots`, 404, RTL smoke test.

**Start with P1 only. Do not run ahead.**

## 8. Known gaps — use placeholders, never invent content
Leadership content is TBD · the client list and logos are not provided · stat #3's number is pending · contact details and the form backend are undecided · the job feed source is undecided · only a **raster** logo exists (`Images/Logo.jpg`, white background — we need vector) · "Selected Experience" for Construction/Operations/PPP is pending a client go/no-go, so build it behind a content flag.

Also unresolved and relevant to P5: static export can't pre-render detail pages for jobs from a live feed. Options are (a) client-rendered detail view, (b) webhook-triggered rebuild, (c) deep-link out. **Ask me before choosing.**

## 9. Verify before claiming anything is done
Actually run the app and look at it. For each phase: check in a browser at **390 / 768 / 1280px**, do a **keyboard-only pass**, confirm **no horizontal scroll**, and confirm the **reduced-motion** path. Report honestly what you verified versus what you assumed — if something didn't work, say so with the output.

## 10. Start here
1. Import the design (§0).
2. Read the plan and the copy (§1).
3. Tell me: any **conflicts** you found between the imported design and the plan/locked decisions, and your proposed **P1 file list** — then wait for my approval before writing code.
