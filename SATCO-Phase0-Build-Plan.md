# SATCO Corporate Website — Phase 0 Build Plan

**Prepared for:** SATCO (Saudi Arabian Trading & Construction Co.)
**Prepared by:** Front-end architecture
**Status:** Phase 0 — plan for approval. **No application code written yet.**
**Sources reviewed:** `Images/Logo.jpg` (brand extraction), `Resources/New Web Copy.docx` (approved copy, single source of truth), provided image set under `Images/`.

---

## 1. Executive Summary

SATCO's logo is a warm, earthen system: a deep saturated **bronze/amber** sun-over-horizon emblem paired with an understated **taupe/stone** wordmark. There is no green — the mark reads as desert, permanence, and heritage. That is exactly the right emotional register for a 50-year, Saudi-owned infrastructure group speaking to government bodies, giga-project developers, and lenders. The design will lean into that: a restrained bronze-and-stone palette, generous whitespace, quiet motion, and a typographic system that signals engineering precision plus institutional gravitas — never startup gloss.

The UX approach is a **calm, single-authority spine**: a fast loading moment that establishes the 50-year story, a scroll-based home that indexes the four operating sectors and quantifies scale through an animated stat band, then progressively deeper layers (About L1 → sub-pages; Operating Sectors L1 → four L2 capability pages). Content is treated as data — every page's words live in typed `content/` files derived verbatim from the approved copy — so the site is CMS-ready, translatable, and never has copy hard-coded in JSX. The whole system is built mobile-first, WCAG 2.1 AA, static-export-friendly (no server runtime), and structurally RTL-ready (logical properties + `dir` seam) for an English-first launch with Arabic to follow.

---

## 2. Sitemap (App Router route tree)

All routes are statically exportable (`output: 'export'`). Each page pulls its words from a `content/` module — no inline copy.

| Route | File | Page | Copy source (New Web Copy.docx) |
|---|---|---|---|
| `/` | `app/page.tsx` | Home (loading overlay → single scroll) | Homepage scroll-down content |
| `/about` | `app/about/page.tsx` | About Us — L1 (intro + 4 cards) | "About US (Layer 1)" |
| `/about/company` | `app/about/company/page.tsx` | Company Information (long-form) | "Company Information" |
| `/about/leadership` | `app/about/leadership/page.tsx` | Key People & Leadership | "Key People" — **content TBD** |
| `/about/certifications` | `app/about/certifications/page.tsx` | Classifications, Licenses & Certifications | "Classifications, Licenses & Certifications" |
| `/about/clients` | `app/about/clients/page.tsx` | Clients (logo grid + disclaimer) | "Clients" — **logos TBD** |
| `/sectors` | `app/sectors/page.tsx` | Operating Sectors — L1 overview | "Operating Sectors (Layer 1)" |
| `/sectors/airports` | `app/sectors/airports/page.tsx` | Airport Infrastructure & Operations — L2 | "Airport … (L2)" |
| `/sectors/construction` | `app/sectors/construction/page.tsx` | Construction — L2 | "Construction (L2)" |
| `/sectors/operations` | `app/sectors/operations/page.tsx` | Integrated Operations & Support Services — L2 | "Integrated Operations … (L2)" |
| `/sectors/ppp` | `app/sectors/ppp/page.tsx` | Public–Private Partnerships — L2 | "Public–Private Partnerships (L2)" |
| `/careers` | `app/careers/page.tsx` | Careers (intro, life, filters, listings, hiring, general app) | "Careers page" |
| `/careers/[slug]` | `app/careers/[slug]/page.tsx` | **Job detail** (summary, responsibilities, requirements, location, apply) | Comment #42 — **required** |
| `/contact` | `app/contact/page.tsx` | Contact Us (form + details + map placeholder) | "Contact Us (Follow current site)" |
| `*` | `app/not-found.tsx` | 404 | — |

> ⚠ **Static-export tension (decide before P5).** Comment #42 requires per-job detail pages fed by a **live LinkedIn/ATS feed**. `output: 'export'` pre-renders at build time, so it cannot generate detail pages for jobs that appear after the build. Three viable options: **(a)** client-rendered detail view (`/careers/role?id=…`) that fetches the feed in the browser — fully static-compatible, no rebuild; **(b)** webhook-triggered rebuild on feed change — real URLs and best SEO, but jobs lag until the rebuild; **(c)** pre-render only mock/mirrored jobs and deep-link out to LinkedIn/ATS to apply. Recommend **(b)** for SEO-visible roles if a rebuild hook is acceptable, else **(a)**. See open question 7.

**Naming confirmed/adjusted:** I kept your proposed slugs exactly, using `operations` for *Integrated Operations & Support Services* and `ppp` for *Public–Private Partnerships*.

**Planned but NOT built (hooks only):**
- `/projects` (Current / Completed) — referenced from Airports L2 ("Full project details are available here"). Plan a top-level, sector-filterable Projects home for later; for now render the link **disabled/hidden** and reserve the route. Future children: `/projects/current`, `/projects/completed`.
- `/vendors` — **vendor registration**. Per comment #4 (Bandar, 2026-01-07): the "My SATCO" employee-portal tab is **declined** ("the site is consumer facing and not an employee portal yet"; employees keep the existing Oracle login, decoupled). A separate tab is to be **activated in the future for vendor registration** — reserve the route and the nav slot; do **not** surface it now.
- Arabic locale (`/ar/…` or `dir="rtl"` variant) — structure supports it; not built now.
- Optional legal pages (`/privacy`, `/legal`) — reserve only if hosting/analytics require a policy.

**Mobile sector variants** are **not** separate routes — they are a responsive content variant (`Sector.mobileSummary`) surfaced within the same L1/L2 pages (see §8).

---

## 3. Design Tokens (proposed — pending your approval)

All values below are **derived from the logo**. The primary anchor `#704000` is the emblem bronze sampled directly from `Logo.jpg`; the neutral anchor is the wordmark taupe. Scales were generated with consistent hue and stepped lightness/chroma so tints don't drift neon.

### 3.1 Color — Primary "Bronze" (from the emblem)

| Token | Hex | Use |
|---|---|---|
| `bronze-50` | `#FBF6EF` | Tinted section backgrounds |
| `bronze-100` | `#F5E9D6` | Hover fills, subtle bands |
| `bronze-200` | `#EDD2AB` | Borders on tinted surfaces |
| `bronze-300` | `#E2B26F` | Accent on dark, decorative |
| `bronze-400` | `#DD902C` | Illustrative accents |
| `bronze-500` | `#C0720C` | Accent / hover on light |
| `bronze-600` | `#A05C03` | Secondary emphasis |
| `bronze-700` | `#8A4E00` | Link / button hover |
| **`bronze-800`** | **`#704000`** | **Brand anchor — primary CTA, links, key headings** |
| `bronze-900` | `#573000` | Deep emphasis, footer accents |
| `bronze-950` | `#351E03` | Near-black warm |

### 3.2 Color — Neutral "Stone" (from the wordmark)

| Token | Hex | Use |
|---|---|---|
| `stone-50` | `#FBFAF8` | Page background (warm white) |
| `stone-100` | `#F7F6F2` | Alt section background |
| `stone-200` | `#EAE7E1` | Hairline dividers, card borders |
| `stone-300` | `#D8D3CA` | Decorative borders |
| `stone-400` | `#B4AC9D` | Disabled text, placeholder |
| `stone-500` | `#8F8570` | Muted/caption text |
| `stone-600` | `#726A5A` | Secondary body text |
| `stone-700` | `#5B5548` | **Primary body text** |
| `stone-800` | `#454036` | Strong text |
| `stone-900` | `#2E2A24` | Footer/section-inverse background |
| `stone-950` | `#1D1A16` | Max-dark warm ink |
| `ink` | `#231F1A` | Headings on light (warm near-black) |
| `sand` | `#F7F4ED` | Signature warm surface for feature bands |

### 3.3 Semantic / functional colors

| Token | Hex | Use |
|---|---|---|
| `bg` | `stone-50 #FBFAF8` | Default page background |
| `surface` | `#FFFFFF` | Cards |
| `text` | `stone-700 #5B5548` | Body |
| `text-strong` | `ink #231F1A` | Headings |
| `text-muted` | `stone-500 #8F8570` | Captions |
| `primary` | `bronze-800 #704000` | CTAs, links, focus |
| `primary-hover` | `bronze-700 #8A4E00` | Hover |
| `border` | `stone-200 #EAE7E1` | Dividers |
| `focus-ring` | `bronze-800 #704000` | Keyboard focus |
| `success` | `#3F6B2E` | Form success (warm-tuned green) |
| `warning` | `#B4790C` | Warnings |
| `error` | `#9B2C1E` | Form errors (warm-tuned red) |
| `info` | `#3A5566` | Info notes |

**Contrast — verified (WCAG 2.1):**

| Pair | Ratio | AA normal (4.5) | AA large (3.0) |
|---|---|---|---|
| Body `stone-700` on white | **7.40:1** | ✅ | ✅ |
| Secondary `stone-600` on white | **5.35:1** | ✅ | ✅ |
| Heading `ink` on white | **16.4:1** | ✅ | ✅ |
| Link/heading `bronze-800` on white | **8.67:1** | ✅ | ✅ |
| White on `bronze-800` (primary button) | **8.67:1** | ✅ | ✅ |
| White on `bronze-700` (button hover) | **6.62:1** | ✅ | ✅ |
| `bronze-800` on `sand` | **7.89:1** | ✅ | ✅ |
| `bronze-300` on `stone-900` (accent on dark) | **7.35:1** | ✅ | ✅ |

> Note: `stone-200/300` are decorative hairlines (not text). Where a border must communicate an *essential* control boundary, we use `stone-400` or `bronze-800` to clear the 3:1 non-text threshold.

### 3.4 Typography (free / self-hostable — no paid fonts)

Two pairings proposed. **Recommended: Pairing A** (modern-institutional, engineering-precise). **Pairing B** is the heritage alternative if you want more warmth/gravitas.

| | Headings | Body / UI | Why |
|---|---|---|---|
| **A — Recommended** | **Archivo** (variable, SIL OFL) | **Inter** (variable, SIL OFL) | Confident grotesque headings read monumental and institutional; Inter is neutral and superb for long copy + tabular stat numerals. |
| **B — Heritage alt** | **Source Serif 4** (variable, OFL) | **Source Sans 3** (variable, OFL) | A coherent superfamily; the serif conveys 50-year heritage and lender-grade trust. |

Both self-hosted via `next/font/local` (woff2 committed to the repo) — **no external Google Fonts request at runtime**, which keeps static export fully offline and CSP-clean. A monospace (`ui-monospace` stack) is reserved for spec/figures if ever needed.

**Type scale** (rem; fluid `clamp()` on display sizes):

| Token | Size | Line-height | Typical use |
|---|---|---|---|
| `text-xs` | 0.75 | 1.5 | Labels, legal |
| `text-sm` | 0.875 | 1.5 | Captions, meta |
| `text-base` | 1.0 | 1.65 | Body |
| `text-lg` | 1.125 | 1.6 | Lead paragraphs |
| `text-xl` | 1.25 | 1.5 | Card titles |
| `text-2xl` | 1.5 | 1.35 | Sub-section headings |
| `text-3xl` | 1.875 | 1.25 | Section headings |
| `text-4xl` | `clamp(2rem, 4vw, 2.5rem)` | 1.15 | Page titles |
| `text-5xl` | `clamp(2.5rem, 6vw, 3.25rem)` | 1.08 | Hero headline |
| `text-6xl` | `clamp(3rem, 8vw, 4.5rem)` | 1.05 | Loading wordmark |

Weights: body 400/500/600; headings 600/700 (Archivo) or 500/600 (Source Serif). Tracking: display headings −0.5% to −1.5%. **Loading wordmark — per comment #2 (locked):** regular/medium weight (**not bold**) with letter-spacing **+2% to +4%** only. *(This supersedes the heavier, wider treatment shown on the earlier approval board.)*

### 3.5 Spacing scale (4px base)

| Token | px | | Token | px |
|---|---|---|---|---|
| `space-1` | 4 | | `space-8` | 32 |
| `space-2` | 8 | | `space-10` | 40 |
| `space-3` | 12 | | `space-12` | 48 |
| `space-4` | 16 | | `space-16` | 64 |
| `space-5` | 20 | | `space-20` | 80 |
| `space-6` | 24 | | `space-24` | 96 |
| `space-7` | 28 | | `space-32` | 128 |

Section rhythm tokens: `section-y` = `clamp(4rem, 8vw, 8rem)` (vertical section padding); `container-x` = `clamp(1.25rem, 5vw, 2.5rem)` (gutter). Content container max-width **1200px**; prose measure **68ch**.

### 3.6 Radius

| Token | px | Use |
|---|---|---|
| `radius-xs` | 2 | Inputs, tags |
| `radius-sm` | 4 | Buttons |
| `radius-md` | 8 | Cards |
| `radius-lg` | 12 | Feature panels, images |
| `radius-xl` | 16 | Hero media |
| `radius-full` | 9999 | Pills, avatars |

Restrained by design — an institutional feel favors small radii (2–8px) over rounded/playful.

### 3.7 Shadow (warm-tinted, low alpha — never pure black)

| Token | Value |
|---|---|
| `shadow-xs` | `0 1px 2px rgba(45,42,36,0.06)` |
| `shadow-sm` | `0 2px 6px rgba(45,42,36,0.08)` |
| `shadow-md` | `0 6px 16px rgba(45,42,36,0.10)` |
| `shadow-lg` | `0 16px 40px rgba(45,42,36,0.12)` |
| `shadow-focus` | `0 0 0 3px rgba(112,64,0,0.35)` (bronze focus halo) |

### 3.8 Motion

| Token | Value | Use |
|---|---|---|
| `dur-fast` | 150ms | Hover, taps |
| `dur-base` | 250ms | Most transitions |
| `dur-slow` | 400ms | Reveals |
| `dur-xslow` | 700ms | Loading curtain, hero |
| `ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | General |
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Scroll reveals |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Slider crossfades |
| `reveal-distance` | 20px | translateY on reveal |
| `stagger` | 80ms | Child stagger |

All motion is gated by `prefers-reduced-motion` (see §7).

---

## 4. Folder Structure

```
satco-web/
├─ app/
│  ├─ layout.tsx                 # Root: <html lang dir>, fonts, Nav, Footer, SkipLink, MotionConfig
│  ├─ page.tsx                   # Home — assembles Hero, WhoWeAre, SectorsOverview, teasers
│  ├─ template.tsx               # Per-route mount → page transition wrapper
│  ├─ not-found.tsx              # 404
│  ├─ globals.css                # Tailwind layers + base element styles
│  ├─ about/
│  │  ├─ page.tsx                # About L1
│  │  ├─ company/page.tsx
│  │  ├─ leadership/page.tsx
│  │  ├─ certifications/page.tsx
│  │  └─ clients/page.tsx
│  ├─ sectors/
│  │  ├─ page.tsx                # Sectors L1
│  │  ├─ airports/page.tsx
│  │  ├─ construction/page.tsx
│  │  ├─ operations/page.tsx
│  │  └─ ppp/page.tsx
│  ├─ careers/page.tsx
│  └─ contact/page.tsx
├─ components/
│  ├─ layout/                    # Nav, MobileNav, Footer, Container, Section, SkipLink, Breadcrumbs
│  ├─ home/                      # Hero, SectorSlider, StatBand, WhoWeAre, SectorsOverview, *Teaser
│  ├─ sectors/                   # SectorHero, CapabilityBlock, DeliveryModels, SelectedExperience, WhySatco, MobileSectorSummary
│  ├─ about/                     # SubPageCardGrid, LongForm, CertList, ClientGrid, LeadershipGrid
│  ├─ careers/                   # JobFilters, JobList, JobCard, HowWeHire, GeneralApplicationCTA
│  ├─ contact/                   # ContactForm, ContactDetails, MapPlaceholder
│  ├─ loading/                   # LoadingScreen, LogoLockup (A + B variants)
│  ├─ motion/                    # Reveal, CountUp, PageTransition, MotionProvider
│  └─ ui/                        # Button, Link, SectionHeader, Card, Tag, Badge, Field, Select, Icon
├─ content/                      # SINGLE SOURCE OF TRUTH — typed copy, no words in JSX
│  ├─ site.ts                    # name, tagline, contact, socials, nav flags
│  ├─ navigation.ts              # nav tree (dropdowns)
│  ├─ stats.ts                   # Stat[]
│  ├─ sectors.ts                 # Sector[] (overview, capabilities, delivery, experience, why, mobileSummary)
│  ├─ company.ts                 # Company Information long-form
│  ├─ certifications.ts          # Classification[] + License[] + Certification[]
│  ├─ clients.ts                 # Client[] + legal disclaimer
│  ├─ leadership.ts              # LeadershipMember[] (placeholder — TBD)
│  └─ jobs.ts                    # Job[] MOCK (⚠ TODO: live LinkedIn/ATS feed)
├─ lib/
│  ├─ types.ts                   # Shared TS interfaces (§5)
│  ├─ jobs.ts                    # search/filter helpers + live-feed adapter seam
│  ├─ motion.ts                  # Framer variants + easing tokens
│  ├─ seo.ts                     # metadata() helpers, OG
│  └─ utils.ts                   # cn(), number/format helpers
├─ styles/
│  └─ tokens.css                 # ALL design tokens as CSS custom properties (imported first)
├─ public/
│  ├─ fonts/                     # self-hosted woff2
│  ├─ images/{airports,construction,operations,ppp,brand,clients}/
│  └─ favicon + logo (SVG/PNG)
├─ tailwind.config.ts            # maps tokens → theme; default palette disabled (no leakage)
├─ next.config.mjs               # output:'export', images.unoptimized, trailingSlash:true
├─ postcss.config.mjs
├─ tsconfig.json                 # strict, path alias @/*
└─ package.json
```

**One-line purpose per top folder:** `app/` routes & layouts · `components/` reusable UI grouped by domain · `content/` all page copy as typed data · `lib/` types, helpers, motion, SEO · `styles/` the token layer · `public/` static assets (fonts, images, logo).

---

## 5. Content Model (TypeScript interfaces)

Page copy lives in typed `content/*.ts` files (single source of truth) and is imported by pages — **never** hard-coded in JSX. This makes the site translatable, CMS-swappable, and diff-reviewable. Illustrative shapes (final in `lib/types.ts`):

```ts
export type SectorSlug = 'airports' | 'construction' | 'operations' | 'ppp';

export interface CTALink { label: string; href: string; external?: boolean; disabled?: boolean; }

export interface ImageRef {
  src: string;
  alt: string;              // REQUIRED — a11y policy (empty string only for decorative)
  width?: number; height?: number;
  credit?: string;
}

export interface Capability {
  id: string;
  title: string;            // "Passenger Boarding & Aircraft Support Systems"
  body: string;             // verbatim approved copy
}

export interface DeliveryModel { models: string[]; description: string; } // ["Design–Build","DBFOM","BOT","BTO"]

export interface SelectedExperience {
  status: 'confirmed' | 'pending-decision';   // Construction/Operations/PPP = pending
  body: string;
  projectsLink?: CTALink;                       // Airports → future /projects hook
}

export interface Sector {
  slug: SectorSlug;
  name: string;             // full name
  shortName: string;        // "Airports"
  tagline: string;          // hero one-liner ("Supporting the region's most critical airport operations")
  overviewShort: string;    // L1 overview paragraph
  overview: string;         // L2 overview (~100 words)
  capabilities: Capability[];
  delivery: DeliveryModel;
  experience: SelectedExperience;
  whySatco: string;         // "Why SATCO in X"
  mobileSummary: string;    // condensed one-screen mobile variant
  hero: ImageRef;
  gallery?: ImageRef[];
  order: number;
}

export interface Stat {
  id: string;
  label: string;            // "Aircrafts Served"
  value: number | null;     // 1_300_000 — null when TBD
  display: string;          // "1.3M+"
  suffix?: string;          // "sqm" | "Persons"
  countUp?: boolean;
}

export interface Classification { category: string; activities: string[]; } // "Category 1", [...]
export interface License { name: string; scope: string; }                    // GACAR Part 151
export interface Certification {
  code: string;             // "ISO 9001:2015"
  title: string;            // "Quality Management"
  group: 'iso' | 'leed' | 'other';
  note?: string;            // "SILVER — Neom Laydown Offices"
  image?: ImageRef;         // certificate scan/badge — comment #28: client wants these shown on the site
}

// Comments #31 — the Clients page has TWO populations, not one.
export interface Client {
  id: string;
  name: string;
  tier: 'selected' | 'directory';  // 'selected' → the logo grid (18–24, hard max 30); 'directory' → A–Z text list
  logo?: ImageRef;                 // required when tier==='selected'; rendered GRAYSCALE, normalized height
  sector?: SectorSlug[];           // future directory filter (not required now)
  geography?: string;              // future directory filter (not required now)
  // NOTE: logos are deliberately NEVER linked — client instruction, "avoid endorsement optics".
}

// Comment #42 — every job needs a DETAIL PAGE; summary/responsibilities/requirements are mandatory.
export interface Job {
  id: string;
  slug: string;                 // → /careers/[slug]
  title: string;                // "Senior Project Manager – Construction"
  location: string;             // "Saudi Arabia"
  sector: SectorSlug;
  discipline: string;           // filter facet
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  type?: 'full-time' | 'contract';
  postedAt?: string;            // ISO — mock sort key
  summary: string;              // detail page — role summary
  responsibilities: string[];   // detail page
  requirements: string[];       // detail page
  applyHref: string;            // ⚠ live ATS/LinkedIn apply URL — NEVER a PDF or mailto (comment #42)
  source: 'mock' | 'linkedin' | 'ats';
}

export interface LeadershipMember {
  id: string; name: string; title: string;   // ⚠ TBD content
  bio?: string; photo?: ImageRef; order: number;
}

export interface NavItem { label: string; href?: string; children?: NavItem[]; }
```

---

## 6. Component Inventory

**Layout / chrome**
- `Nav` — desktop top nav with accessible dropdowns (About ▾, Operating Sectors ▾), scroll-aware background.
- `MobileNav` — slide-in panel, accordion sub-menus, focus trap, scroll-lock.
- `Footer` — sitemap columns, contact summary, legal line, sector links.
- `Container` — max-width + responsive gutter wrapper.
- `Section` — vertical rhythm + optional tinted/`sand` background + `aria-labelledby`.
- `SkipLink` — "Skip to content" for keyboard users.
- `Breadcrumbs` — L2/sub-page orientation (logical-property aware).

**Loading**
- `LoadingScreen` — first-visit overlay; curtain reveal into Home; once-per-session.
- `LogoLockup` — renders **Variant A** (emblem + wordmark + tagline) or **Variant B** (wordmark only + tagline).

**Home**
- `Hero` — houses the 4-sector visual index + headline + StatBand.
- `SectorSlider` — accessible carousel of 4 sector slides (title, one-line, "→ Explore" → L2).
- `StatBand` — 6 count-up stats with tabular figures.
- `WhoWeAre` — short intro block + CTA to About.
- `SectorsOverview` — 4 sector blocks (→ each L2).
- `CareersTeaser`, `ContactTeaser` — CTA blocks.

**Sectors**
- `SectorHero` — L2 header (name, overview, key image, breadcrumb).
- `CapabilityBlock` — one core-capability sub-block (title + body); accordions on mobile.
- `DeliveryModels` — model tags + description.
- `SelectedExperience` — experience narrative; supports `pending-decision` toggle + optional Projects link.
- `WhySatco` — "Why SATCO in X" closing block.
- `SectorCardGrid` — L1 grid of the 4 sectors.
- `MobileSectorSummary` — condensed `mobileSummary` variant + "View detailed capabilities →".

**About**
- `SubPageCardGrid` — the 4 About cards.
- `LongForm` — prose renderer (Company Information) with 68ch measure.
- `CertList` — Government Classifications + Licenses + ISO/LEED groups; **renders certificate images/badges** (comment #28).
- `ClientLogoGrid` — **"Selected Clients"** (that exact label — client instruction: *avoid "All Clients"*): 18–24 logos, hard max 30; **6 / 3 / 2 columns** (desktop/tablet/mobile); **grayscale only**, normalized heights, equal visual weight; **unlinked**; no animation beyond a subtle fade-in on scroll.
- `ClientDirectory` — **Full Client List**: searchable, **text-only A–Z**, "Search clients" field, fast client-side search, 2 columns desktop / 1 mobile, clean type, no bullets, unlimited entries. (Sector/Geography filters designed-for but not built now.)
- `ClientDisclaimer` — the verbatim legal line, small, once, at the page bottom.
- `LeadershipGrid` — CMS-ready people grid (placeholder now).

**Careers**
- `JobFilters` — keyword, location, sector, discipline, experience level (wired to mock).
- `JobList` / `JobCard` — filtered results; empty state.
- `JobDetail` — **per-role detail view** (comment #42): role summary, responsibilities, requirements, location, apply button. No PDF or email-only workflow.
- `HowWeHire` — process block.
- `GeneralApplicationCTA` — "Submit your profile".

> **Careers tone rules (comment #42, binding on any microcopy we write):** no "family", no "rockstars", no exaggerated culture claims — focus on work, scale, and professionalism.

**Contact**
- `ContactForm` — accessible form (labels, validation, aria); submit seam (TBD backend).
- `ContactDetails` — address/phone/email/hours.
- `MapPlaceholder` — static map region (no third-party runtime unless approved).

**UI primitives**
- `Button` (primary/secondary/ghost), `Link` (internal/external + arrow), `SectionHeader`, `Card`, `Tag`, `Badge`, `Field`, `Select`, `Icon`.

**Motion**
- `MotionProvider` — global `MotionConfig reducedMotion="user"`.
- `Reveal` — scroll-in fade+rise wrapper (once).
- `CountUp` — number animation on in-view.
- `PageTransition` — route change fade/slide.

---

## 7. Interaction & Motion Plan

- **Loading → Home — LOCKED by comment #2 (Bandar, 2025-12-16).** *"This is not a splash screen. It is a moment of acknowledgment, not a branding exercise… If it lingers or animates too much, it becomes noise."* The spec, verbatim in intent:
  - **Timing: 1.2s total (ideal), 1.5s absolute maximum** — fade in 300ms → hold 600ms → fade out 300ms → **immediate** transition to the homepage hero. *"No easing tricks. Linear or ease-in-out only."*
  - **No curtain/clip reveal, no scale, no imagery, no gradients, no overlays.** A plain fade on a white or very light off-white background.
  - **Type:** same family as the site, regular/medium weight (**not bold**), letter-spacing +2–4%, centred both axes.
  - **Locked text (frozen): "Celebrating over 50 years of excellence".**
  - **Logo:** optional, small, monochrome, **above** the text (never beside it). *"If in doubt → remove logo. Text alone is sufficient."* → This **answers open question 12**.
  - **Behaviour:** shows once per session (`sessionStorage`); does **not** repeat on internal navigation; does **not** block scrolling after fade-out. Mobile: same timing, no swipe/tap — *"must not feel like an interstitial ad."*
  - **Reduced motion: skip the animation entirely and load the homepage directly** (not merely a faster fade).
  - **After fade-out:** the hero is already positioned — no jump, no reload.
  - ⚠ **Open:** Tarek (comment #1) wants to compare **1.5s / 2s / 3s** before accepting 1.5s as the cap. Build the LoadingScreen with the duration as a single token so all four timings can be previewed, and settle it with a side-by-side demo (see open question 15).
- **Hero sector slider:** Accessible carousel of the 4 slides. Slow auto-advance (~6s) that **pauses on hover/focus**, with a visible pause control, prev/next, and dot/tab indicators. Each slide = full-bleed sector image + bronze→ink gradient scrim (for text contrast) + title + one-line + "→ Explore". Keyboard: arrow keys move slides, Tab reaches controls; `aria-roledescription="carousel"`, slides as labelled groups, `aria-live="polite"` on change.
- **Stat count-up:** `StatBand` animates each number 0→target once it scrolls into view (IntersectionObserver, fires once). Only the numeric part animates; suffixes ("M+", "K+", "sqm", "Persons") are preserved; tabular figures prevent width jitter.
- **Scroll reveal:** Sections wrap in `Reveal` — opacity 0→1 + translateY 20px→0 (`dur-slow`, `ease-out-expo`), children staggered 80ms. Uses Framer `whileInView` with `once: true` and a small viewport margin so content is committed before it's read.
- **Nav dropdowns:** Open on hover-intent (desktop) and on click/Enter/Space (keyboard); Arrow keys move within the menu; Esc closes and returns focus to the trigger; menus close on outside-click and on route change. `aria-haspopup`, `aria-expanded`, animated underline indicator. `MobileNav` uses a focus trap + scroll lock + accordions.
- **Page transitions:** Short (200–300ms) opacity/slide via `template.tsx` + Framer — deliberately understated (institutional, not flashy).
- **Reduced motion:** `MotionProvider` sets `reducedMotion="user"`. When the user prefers reduced motion: no curtain (instant fade), no count-up (final value shown immediately), no carousel autoplay, reveals become opacity-only or instant, page transitions become instant. This is a first-class path, not an afterthought.

---

## 8. Responsive & RTL Strategy

**Breakpoints (mobile-first):** `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`. Container max-width 1200px; fluid gutters and section padding via `clamp()`. Layout grids collapse 4→2→1 columns; typography scales via `clamp()` display sizes.

**How each region reflows (laptop → phone):**

| Region | Laptop (≥1024) | Tablet (768–1023) | Phone (<768) |
|---|---|---|---|
| Top nav | Full horizontal nav + hover/focus dropdowns | Condensed nav | Hamburger → `MobileNav` slide-in + accordions |
| Hero sector slider | Full-bleed image, text overlay, side controls | Same, smaller type | Stacked (image over text), swipe + dots, taller tap targets |
| Stat band | 6 across (or 3×2) | 3×2 | 2×3, count-up preserved |
| Sector / About cards | 4 or 2 columns | 2 columns | 1 column, stacked |
| L2 capability blocks | 2-column, expanded | 2→1 column | 1 column, tap-to-expand accordions |
| Careers filters | Inline filter bar | Wrapped | Collapsible "Filters" sheet |
| Contact | Form + details side-by-side | Stacked | Stacked, full-width fields |
| Footer | Multi-column | 2 columns | Stacked (optional accordion) |

**Phone-specific commitments:**
- **Touch targets** ≥ 44×44px with ≥ 8px spacing; **no hover-only actions** — every desktop hover (nav dropdowns, card states) has an equivalent tap/focus path.
- **Responsive images:** because static export uses `images.unoptimized`, we pre-generate width variants and ship `srcset`/`sizes` (+ AVIF/WebP) so phones download small files; the hero uses art-direction (`<picture>`) — a tighter/portrait crop on phones, wide crop on laptops.
- **No fixed pixel widths:** type and spacing use `clamp()`/rem; content max-width caps line length on laptops while everything fluidly narrows on phones.
- **Respect user zoom / OS font size** (rem units, no `maximum-scale` lock); primary CTAs kept thumb-reachable.
- **Tested on real breakpoints** in P7: 360/390px phones, 768px tablet, 1280/1440px laptop, plus landscape phone.

**Mobile sector variants (progressive disclosure, not a separate site):** The four sectors carry both full copy and a condensed `mobileSummary` in the content model. On small viewports the Operating Sectors context surfaces `MobileSectorSummary` (the toned-down one-screen copy from the doc) with a "View detailed capabilities →" link into the full, responsive L2 page. On L2, long Core-Capabilities lists become accordions (`<details>`/disclosure) on mobile so the page stays scannable. Same routes, same content source — one responsive site.

**RTL readiness (English now, Arabic later — no Arabic built):**
- **Logical properties everywhere:** `margin-inline`, `padding-inline`, `inset-inline-start/end`, `text-align: start`; Tailwind logical utilities (`ms-/me-/ps-/pe-/start-/end-`). **No physical `left`/`right`** in layout code.
- **`dir` seam:** `<html lang="en" dir="ltr">` now; flipping to `dir="rtl"` later re-lays the entire system from the same tokens with no rewrites.
- **Directional icons:** the "→ Explore" arrows and breadcrumb chevrons are logical/mirrored (flip under RTL via transform or logical icon swap).
- **Token naming** is already direction-neutral (`start`/`end`, not `left`/`right`).
- **Future font seam:** reserve an Arabic-capable family (e.g., IBM Plex Sans Arabic / Noto Kufi Arabic) to swap in under `dir="rtl"`; numerals (Western vs Arabic-Indic) decided at that time.

---

## 9. Accessibility Plan (WCAG 2.1 AA commitment)

- **Landmarks & semantics:** one `<header>`/`<nav>`, one `<main>`, one `<footer>`; every `<section>` labelled via `aria-labelledby`. Correct heading order (single `h1` per page). Stats and capability lists are real lists. Links vs buttons used correctly.
- **Focus management:** visible bronze focus ring (`shadow-focus`, 3:1+); on client navigation, focus moves to `main`/page `h1` so it's never lost; dropdown, mobile-nav, and carousel maintain logical focus order; skip-to-content link first in tab order.
- **Keyboard operability:** nav dropdowns (Enter/Space/Arrows/Esc), mobile menu (trap + Esc), carousel (arrows, pause, reachable controls), job filters (native selects/checkboxes in a `fieldset`/`legend`), forms (labels tied to inputs, `aria-describedby` for errors, `aria-invalid`).
- **Alt-text policy:** every `ImageRef.alt` is required and meaningful; sector/hero images described by purpose; **decorative** images use `alt=""` + `aria-hidden`; client logos use `"{Client name} logo"`.
- **Color & contrast:** committed AA per the verified table in §3.3 (body 7.4:1, primary CTA 8.67:1, links 8.67:1). Meaning never conveyed by color alone (icons/text accompany state). Focus and essential borders clear 3:1.
- **Motion:** `prefers-reduced-motion` honored globally (§7).
- **Verification:** axe + Lighthouse + manual keyboard walkthrough each phase; the `design:accessibility-review` skill for structured audits at P7 and on complex components (slider, mobile nav, forms).

---

## 10. Build Roadmap (ordered; "approve to build" unlocks each)

| Phase | Scope | Unlocks / depends on |
|---|---|---|
| **P0 (now)** | This plan → your approval of tokens, fonts, sitemap, open questions. | Gate for everything. |
| **P1 — Foundation** | Next.js + Tailwind token config, `tokens.css`, self-hosted fonts, `globals`, root layout, **Nav + MobileNav + Footer + Container/Section + SkipLink**, `content/site.ts` + `navigation.ts` + `types.ts`, motion provider, reduced-motion. **Deliver: navigable shell** with real nav/footer and empty routed pages. | Needs approved tokens + font pairing + sitemap. |
| **P2 — Home** | LoadingScreen (both lockups), Hero `SectorSlider`, `StatBand` count-up, WhoWeAre, SectorsOverview, Careers/Contact teasers, scroll-reveal. | Needs P1 + sector/stat content + hero imagery. |
| **P3 — About layer** | About L1 (SubPageCardGrid), Company Information (LongForm), Certifications (CertList), Clients (ClientGrid + disclaimer), Leadership (placeholder grid). | Needs P1; Clients (logos) + Leadership (content) build as placeholders. |
| **P4 — Sectors L1 + L2 ×4** | Sectors L1 overview + four L2 pages (SectorHero, CapabilityBlock, DeliveryModels, SelectedExperience, WhySatco), mobile summaries, Projects route **hook** (disabled). Largest content phase. | Needs P1 + full sector content + imagery. |
| **P5 — Careers** | Typed `Job` model, mock list, `JobFilters` wired to mock, JobList/JobCard, empty state, How We Hire, General Application CTA. **Live LinkedIn/ATS feed marked as TODO seam** (`lib/jobs.ts` adapter). | Needs P1. Independent of P2–P4. |
| **P6 — Contact** | ContactForm (a11y + validation), ContactDetails, MapPlaceholder. | Needs P1 + real contact details + form-backend decision (see §11). |
| **P7 — Polish / a11y / perf** | Reveal tuning, page transitions, reduced-motion QA, axe/Lighthouse, keyboard walkthrough, image pipeline (pre-optimize to responsive AVIF/WebP — `images.unoptimized` for export), metadata/OG, `sitemap.xml`/`robots`, 404, RTL smoke test, cross-browser. | Needs P2–P6. |

**Parallelism:** content entry (populating `content/*.ts` from the doc) can run alongside component work because copy and components are decoupled. P5 (Careers) can proceed independently once P1 lands.

---

## 11. Tooling, Skills & Connectors Setup

You asked to plan the tools, skills, and connectors. The build itself depends on **none** of the external connectors — content lives in typed files and static export needs no server — so these are accelerators, sequenced by need. Honest status is noted for each.

### 11.1 Claude Code skills to use during the build (available now)
| Skill | Where it's used |
|---|---|
| `design:design-system` | Audit/document the token + component system (P1, ongoing). |
| `design:accessibility-review` | WCAG AA audits of slider, mobile nav, forms, and full pages (P2–P7). |
| `design:design-critique` | Hierarchy/usability review of each page before sign-off. |
| `design:design-handoff` | Spec sheets if design and dev are split across people. |
| `design:ux-copy` | Microcopy the doc doesn't cover — button labels, empty states, form errors, filter placeholders. |
| `anthropic-skills:docx` | Reading/round-tripping `New Web Copy.docx` (already used to extract copy). |
| `dataviz` | The StatBand and any future figures/charts. |
| `verify` / `run` | Drive the app in-browser to confirm each phase actually works. |
| `code-review` | Review the diff at the end of each phase. |
| `init` | Generate `CLAUDE.md` once the app is scaffolded (start of P1). |
| `artifact-design` | Publish visual previews/mockups for your approval between phases. |

### 11.2 MCP connectors — relevance, and honest auth status
> **Important:** This session is **non-interactive**, so I **cannot run the OAuth sign-in** for any of the connectors below. To enable them you'll authorize them yourself — **claude.ai connectors** via *claude.ai → Settings → Connectors*; **local MCP servers** via `claude mcp add …` and `/mcp` in an **interactive** Claude Code terminal. I won't ask you for tokens or codes. Until connected, I proceed with local `content/*.ts` as the source of truth (no blocker).

| Connector | Why it helps SATCO | Status / action |
|---|---|---|
| **Figma** (`plugin:design:figma`) | Import design frames/tokens; keep design ↔ code in sync. | **Needs auth** (interactive). Optional. |
| **Notion** (`plugin:design:notion`) | Lightweight CMS for copy, **Key People** content, and the **Clients** list the client can edit; we sync into `content/*.ts`. | **Needs auth** (interactive). Recommended if the client wants to edit copy. |
| **Slack** (`plugin:design:slack`) | Build/deploy notifications, review pings. | **Needs auth** (interactive). Optional. |
| **Linear / Asana / Jira (Atlassian)** | Track this P1–P7 roadmap as tickets. | **Needs auth** (interactive). Pick one; optional. |
| **Intercom** | Support chat — not needed for launch. | Skip. |
| **Supabase** (MCP) | Self-owned backend option for **Contact form** submissions, **General/Job applications with CV upload** (Storage), and later a real **Jobs table** feeding Careers. Works with static export via the client SDK (+ RLS) or Edge Functions. | **Available now** in this session. Use only if you choose a self-owned backend over a third-party form (see §11.3). |
| **Design board MCP** (boards/docs/diagrams/tables) | Host the sitemap diagram, token table, and component inventory as shareable design docs for stakeholder review. | Available now. Optional. |

### 11.3 Backend seam for forms (decision needed — see §12)
Static export has no server runtime, so **Contact** and **General Application** submissions need one of:
- **Third-party form** (Formspree / Netlify Forms / Web3Forms) — fastest, no backend to own.
- **Supabase** (connector above) — self-owned DB + Storage for CVs; still static-export compatible via client SDK/Edge Functions. Recommended if data ownership matters.
- **Email relay** (mailto or serverless function on the host) — simplest, least structured.
We'll build the form UI against a typed submit seam so the provider can be chosen without reworking the component.

---

## 12. Open Questions / Assumptions

Numbered so you can resolve inline. Items marked ⚠ block or shape a specific phase.

1. **Stat #3 has no number.** The copy lists "Residential & Community Assets Delivered: **Buildings**" with no figure. Need the count (e.g., "X+ buildings"). *Assumption: placeholder until provided.* (P2)
2. ⚠ **Key People & Leadership content is TBD** ("We need to work on this content"). Building a CMS-ready placeholder grid. Need names, titles, photos (yes/no?), bios. (P3)
3. ~~**Clients instructions unreadable.**~~ **RESOLVED** — comment #31 has been read and its full spec is now folded into §6 (Selected Clients grayscale grid + searchable A–Z directory + disclaimer). **Still needed:** the approved client list itself (which names are `selected` vs `directory`) and the logo files. (P3)
4. **"Selected Experience" for Construction / Operations / PPP is marked "Strategic Decision Pending."** Draft copy exists. Need a go/no-go per sector. *Assumption: build each as a content-flag toggle so it's a one-line switch.* (P4)
5. **Projects (Current/Completed) page** is referenced from Airports L2 but out of scope now. *Assumption: reserve `/projects`, render the link disabled/hidden.* Need eventual scope (all sectors vs airports-only) and a project data model. (Future)
6. ⚠ **Contact Us says "Follow current site," but I don't have the current site.** Need: office address(es), phone, email, hours, map location/coords, and the **form's destination**. *Assumption: standard corporate layout with a provider seam until decided.* (P6)
7. ⚠ **Careers live data source — partially resolved.** Comment #42 settles the *shape*: **LinkedIn Jobs API or the internal ATS**, **detail pages required** (summary / responsibilities / requirements / location / apply), **no PDFs or email-only workflows**. **Still needed:** (a) *which* source — LinkedIn API vs which ATS; (b) the **static-export decision** from §2 — client-rendered detail (a), webhook rebuild (b), or deep-link out (c). *Assumption meanwhile: UI-only against a typed mock with a documented adapter seam.* (P5)
8. ⚠ **Form/application backend** (§11.3) — third-party form, Supabase, or email relay? Affects CV upload for General Applications. (P6, P5)
9. **Imagery.** The provided set is small (a few images per sector). Need final licensed hero/gallery images per sector, plus brand-approved treatment. *Assumption: optimize the provided images and use tasteful scrims in the interim.* (P2, P4)
10. ⚠ **Logo source files.** Only a **raster JPG on a white background** is provided. For crisp loading lockups, nav, and favicon we need **vector (SVG) / transparent PNG** of the emblem and the "SATCO" wordmark (or the wordmark's typeface). (P1, P2)
11. **Typography choice.** Approve **Pairing A (Archivo + Inter)** or **Pairing B (Source Serif 4 + Source Sans 3)**. (P1)
12. ~~**Loading lockup choice.**~~ **RESOLVED by comment #2** — logo is optional, small, monochrome, above the text; *"if in doubt → remove logo; text alone is sufficient."* Building **text-only by default**, with a small monochrome mark above as an opt-in. (P2)
15. ⚠ **Loading duration — live disagreement.** Bandar (comment #2) locks **1.2s ideal / 1.5s max**; Tarek (comment #1) says he *"can't tell if 1.5 is enough until we see examples"* and wants **1.5s / 2s / 3s** compared. *Plan: build the duration as a single token and ship a side-by-side demo so they can settle it in one sitting.* (P2)
16. ⚠ **Contact department routing — proposal pending.** Sultan (comment #22) proposes an inquiry-type selector routing to departments: partnerships → Info + BD, opportunities → Info + BD, procurement → Info + Procurement, careers → HR, general → Info. **Assigned to Bandar; undecided.** *Affects the contact form's field set and the backend seam (Q8). Designing the field so it can be enabled without rework.* (P6)
17. **Clients disclaimer — two wordings.** The body text says "Client names **/** logos…"; comment #31 gives "Client names **and** logos…" and labels it *"Exact Language… use verbatim"*. **Recommend the comment's version** (presented as legal-reviewed) — confirm. (P3)
18. **Certificate images.** Comment #28 wants ISO certificate **images on the site** and comment #27 asks whether further licenses exist beyond GACAR Part 151. Need the certificate image files and a final license list. (P3)
13. **Hosting / analytics.** Target host for static export (Vercel static / Netlify / S3+CloudFront / Azure Static Web Apps) and analytics (recommend privacy-friendly, e.g., Plausible) — affects CSP and any cookie/consent needs. (P7)
14. **Arabic timing.** Confirm Arabic is a later phase so we bake logical properties + `dir` seam now but don't build i18n routing yet. (Ongoing)

---

## 13. Appendix — decisions extracted from the Word comments

`New Web Copy.docx` carries **20 tracked comments** (stored in `word/comments.xml`, separate from the body text). They contain binding decisions that the body copy alone does not reveal. Summarised here so the plan and the document can't drift apart.

| # | Author / date | Decision | Effect on this plan |
|---|---|---|---|
| 2 | Bandar, 2025-12-16 | **Loading screen fully specified** — 1.2s (max 1.5s), fade only, no easing tricks, regular/medium weight, +2–4% tracking, white/off-white, no imagery; logo optional/small/monochrome/above text; text frozen as "Celebrating over 50 years of excellence"; reduced-motion skips entirely | **Rewrote §7**; corrected §3.4 tracking; **closed Q12** |
| 1 | Tarek, 2025-12-22 | Wants **1.5s / 2s / 3s compared** before accepting the cap | **New Q15** — build duration as a token + ship a demo |
| 4 / 5 | Sultan → Bandar, 2026-01-07 | **"My SATCO" employee tab declined** — site is consumer-facing, employees keep the Oracle login (decoupled). **Reserve a future vendor-registration tab** | §2 "planned but not built" — `/vendors` hook |
| 6–13 | Sultan → Bandar, 2026-01-07 | Proposal to **merge Hero + Operating Sectors declined** — hero stays a showcase of 4 strong sector images + tagline; click goes deeper | **Confirms** existing §6/§7 — no change |
| 16 / 17 | Bandar & Tarek, 2025-12-24 | **Stats still being collected** (chased via Cris); stat 1 = designed + operational capacity across accommodation and services | Confirms **Q1** (the missing "Buildings" figure) |
| 22 | Sultan → Bandar, 2025-12-29 | Proposed **contact routing by inquiry type** to departments | **New Q16** — pending Bandar |
| 27 / 28 / 29 | Bandar, 2025-12→2026-04 | Confirm any **further licenses**; put **ISO certificate images on the site**; add LEED cert | `Certification.image` added; **new Q18** |
| 31 | Bandar, 2025-12-16 | **Full Clients page spec** — "Selected Clients" grayscale logo grid (18–24, max 30; 6/3/2 cols; unlinked; fade-in only) **plus** a searchable text-only A–Z directory; disclaimer verbatim | **Rewrote Clients in §6**, split `Client` model; **closed Q3**; **new Q17** (wording) |
| 42 | Bandar, 2025-12-16 | **Careers**: LinkedIn Jobs API or internal ATS; **job detail pages required**; no PDFs/email-only; tone rules (no "family"/"rockstars") | **New route** `/careers/[slug]`; `Job` model extended; **static-export tension flagged**; **updated Q7** |

Comments 7/8/11/12 are status markers ("resolved" / "re-opened") and carry no content.

---

## Ready to build — approve to proceed to Phase 1?

Approving unlocks **P1 (Foundation)**: the token config, self-hosted fonts, and the navigable shell (Nav, MobileNav, Footer, routed pages). To move fastest, please confirm **(a)** the design tokens in §3 and **(b)** typography **Pairing A or B** (Q11). *(Q12, the loading lockup, is now closed by comment #2 — text-only by default.)* When convenient, the ⚠ items — **2, 3, 6, 7, 8, 10, 15, 16, 17, 18** — unblock P3–P6. Everything else proceeds on the assumptions noted.
