# Brief v2: Build an interactive prototype of the SATCO corporate website
*(v2 supersedes v1. It folds in binding decisions from the client's review comments. Rules marked **LOCKED** came from client sign-off and must not be reinterpreted.)*

## 1. Your role and the deliverable
You are a senior product designer and front-end engineer. Design and build a **high-fidelity, interactive, clickable prototype** of the SATCO corporate website as a **single self-contained HTML file** — inline CSS + vanilla JavaScript, web fonts from Google Fonts, **no build step and no external image files**. It must run by opening the file in a browser. The top navigation, dropdowns, mobile menu, hero carousel, scroll animations, stat count-ups, client search, and job detail views must actually work.

## 2. Who SATCO is (set the tone)
SATCO (Saudi Arabian Trading & Construction Co.) is a Saudi-owned infrastructure and services group, established 1975 — "50+ years of excellence." Four operating sectors: Airport Infrastructure & Operations, Construction, Integrated Operations & Support Services, and Public–Private Partnerships (PPP). Audience: government bodies, giga-project developers, lenders, and senior engineering hires. Tone: **institutional, credible, understated** — a global EPC/infrastructure firm, not a startup. No gimmicks.

## 3. Art direction
Warm, earthen, restrained: a deep **bronze** primary with a **stone/taupe** neutral system (from SATCO's logo — a bronze sun-over-horizon emblem with a taupe wordmark). Generous whitespace, quiet confident motion, flat clean surfaces. **Avoid** neon, heavy gradients, glow, drop-shadow soup. Photography-led layouts, but use placeholder blocks here (§11).

## 4. Design tokens — use EXACTLY these values

Bronze (primary): 50 #FBF6EF · 100 #F5E9D6 · 200 #EDD2AB · 300 #E2B26F · 400 #DD902C · 500 #C0720C · 600 #A05C03 · 700 #8A4E00 · 800 #704000 (brand anchor) · 900 #573000 · 950 #351E03

Stone (neutral): 50 #FBFAF8 · 100 #F7F6F2 · 200 #EAE7E1 · 300 #D8D3CA · 400 #B4AC9D · 500 #8F8570 · 600 #726A5A · 700 #5B5548 · 800 #454036 · 900 #2E2A24 · 950 #1D1A16 · ink #231F1A · sand #F7F4ED

Semantic roles: page bg = stone-50 · card surface = #FFFFFF · body text = stone-700 · headings = ink · muted = stone-500 · primary (CTA/link/focus) = bronze-800 · primary hover = bronze-700 · borders = stone-200 · feature band = sand · success #3F6B2E · warning #B4790C · error #9B2C1E · info #3A5566

Typography (Google Fonts): Headings **Archivo** 600/700, tracking slightly tight on display. Body/UI **Inter** 400/500, body 16px / line-height 1.65, tabular figures for stats. **Sentence case everywhere.** Fluid: page titles clamp(2rem,4vw,2.5rem); hero headline clamp(2.5rem,6vw,4rem).

Spacing/layout: 4px base. Section padding clamp(4rem,8vw,8rem). Container max-width 1200px. Gutter clamp(1.25rem,5vw,2.5rem). Prose ~68ch.
Radius: 4 (buttons) / 8 (cards) / 12 (panels) / 16 (hero media). Shadows: warm low-alpha only, e.g. 0 6px 16px rgba(45,42,36,.10). Focus ring: 3px bronze halo rgba(112,64,0,.35).
Motion: fast 150 / base 250 / slow 400ms. Easings: reveals cubic-bezier(.16,1,.3,1), general cubic-bezier(.2,0,0,1). Honour prefers-reduced-motion. **(The loading screen is exempt — see §6A, it uses linear/ease-in-out only.)**

## 5. Global chrome (every screen)
Sticky top nav: "SATCO" wordmark left (Archivo, bronze-800). Items: **Home · About Us ▾ · Operating Sectors ▾ · Careers · Contact Us**.
- About Us ▾ → Company Information · Key People & Leadership · Classifications, Licenses & Certifications · Clients
- Operating Sectors ▾ → Airport Infrastructure & Operations · Construction · Integrated Operations & Support Services · Public–Private Partnerships (PPP)

**LOCKED — do NOT add a "My SATCO" / employee-portal / login tab.** The site is consumer-facing; employees use a separate existing system. A vendor-registration tab is planned for the future — do not show it now.

Dropdowns open on hover AND click/Enter; close on Esc/outside-click; aria-haspopup / aria-expanded; animated underline. Nav transparent over hero → solid stone-50/white with a stone-200 hairline after scroll. Below 768px: hamburger → full-height slide-in panel, same items as tap-accordions, focus-trap + Esc + scroll-lock. "Skip to content" link first in tab order.
Footer: sitemap columns (About, Operating Sectors, Careers, Contact), one-line descriptor, contact summary, legal line, © current year. Stone-900 bg, bronze-300 accents.

## 6. Screens (single file, working client-side navigation)
Use a hash router or show/hide views; move focus to the new screen's h1 on navigation.

### 6A. Loading → Home — **LOCKED SPEC, follow exactly**
Client direction, verbatim in intent: *"This is not a splash screen. It is a moment of acknowledgment, not a branding exercise. Its job is to mark the milestone, signal confidence, then disappear completely. If it lingers or animates too much, it becomes noise."*
- **Timing: 1.2s total** — fade in 300ms → hold 600ms → fade out 300ms → immediate transition to the hero.
- **Fade only.** No curtain, no clip reveal, no scale, no slide, no parallax. *"No easing tricks. Linear or ease-in-out only."*
- **Background:** white or very light off-white. **No imagery, no gradients, no overlays.**
- **Text (frozen, use exactly):** `Celebrating over 50 years of excellence`
- **Type:** same family as the site, **regular or medium weight — NOT bold**, letter-spacing **+2% to +4%**, centred horizontally and vertically.
- **Logo:** optional, small, monochrome, **above** the text — never beside it. *"If in doubt → remove logo. Text alone is sufficient."* → **Default to text-only**; if you include a mark, make it small and monochrome.
- **Behaviour:** once per session; does **not** repeat on internal navigation; does **not** block scrolling after fade-out. Mobile: same timing, no swipe/tap — *"must not feel like an interstitial ad."*
- **Reduced motion: skip the animation entirely and load the homepage directly.**
- **After fade-out:** the hero is already positioned — no jump, no reload.

**ALSO BUILD — a timing comparison control (this settles an open client disagreement).** One stakeholder locked 1.2s (max 1.5s); another wants to see 1.5s / 2s / 3s before agreeing. So: expose the total duration as a **single variable**, and render a small, clearly-marked review control (fixed to a corner, labelled "Review only — not part of the site") with buttons **1.2s · 1.5s · 2s · 3s** and a **"Replay intro"** button. Clicking a duration replays the intro at that timing, keeping the 25% / 50% / 25% fade-in/hold/fade-out ratio. This control must be visually quiet and trivially removable.

### 6B. Home (single scroll)
**LOCKED:** the Hero and the Operating Sectors section stay **separate** — do not merge them. The hero is *"a showcase of 4 strong images that represent our sectors, with a tagline"*; clicking goes deeper into Operating Sectors. Sections: Hero (4-slide sector index) → stat band → Who We Are → Operating Sectors overview → Careers teaser → Contact teaser. Copy in §7.

### 6C. Operating Sectors (L1) — heading, integrated-platform line, four sector blocks (→ each L2).
### 6D. Sector L2 — Airports — the full template. Copy in §7.
### 6E. About (L1) — intro + four cards.
### 6F. Clients — **full spec in §8. This is a two-part page, not just a logo wall.**
### 6G. Classifications, Licenses & Certifications — Government Classifications (Category 1 list), Licenses (GACAR Part 151), ISO certifications, LEED. **Show certificate images/badges** — the client explicitly wants the certificate visuals on the site, so render a labelled certificate-image placeholder beside each ISO/LEED entry.
### 6H. Careers — intro, Life at SATCO, filter bar, job cards, How We Hire, General Application CTA. **Clicking a job opens a real Job Detail view** (§9).
### 6I. Job Detail — see §9.
### 6J. Contact — form + details + map placeholder. See §10.

## 7. Real copy — use VERBATIM, do not rewrite

HOME — Hero (4 slides; title, one line, "Explore →"):
- Airport Infrastructure & Operations — "Supporting the region's most critical airport operations" (→ Airports L2)
- Construction — "Delivering large-scale developments at national scale"
- Integrated Operations & Support Services — "Ensuring continuity and performance of complex assets"
- Public–Private Partnerships (PPP) — "Partnering in long-term infrastructure delivery"

HOME — Stat band (count up on scroll; keep suffixes):
- Residential Communities Built — 6
- Population Capacity Delivered & Supported — 137K+ Persons
- Residential & Community Assets Delivered — Buildings *(figure still being collected — show the label with a subtle "—" placeholder, do not invent a number)*
- Built & Maintained Environments — 4.8M+ sqm
- Aircrafts Served — 1.3M+
- Airports Supported — 9

HOME — Who We Are: "SATCO is a Saudi-owned infrastructure and services group operating across construction, airport infrastructure, operations and support services, as well as public–private partnerships (PPP). Established in 1975, SATCO supports complex projects that require scale, reliability, and long-term commitment." — CTA "Learn more about SATCO →" (→ About L1)

HOME — Operating Sectors overview: heading "Operating Sectors"; subhead "An integrated platform spanning development, delivery, operations, and long-term partnership." Four blocks, each "View sector →":
- Airport Infrastructure & Operations — "For over fifty years, SATCO has combined deep technical expertise, scale, and execution excellence to shape as well as support the region's most critical airport operations."
- Construction — "SATCO delivers turnkey, end-to-end construction of large-scale developments, including fully integrated villages serving between 10,000 - 50,000 residents, social infrastructure, and essential utilities. Through deep technical expertise, international partnerships, and execution at scale, SATCO supports national development priorities across housing, industrial, as well as critical infrastructure."
- Integrated Operations & Support Services — "SATCO delivers integrated operations and support services that ensure the continuity, safety, as well as long-term performance of complex assets. Our capabilities span facilities management, asset operations, community services, life support services, and landscaping systems—enabling reliable, efficient operations across industrial, institutional, as well as urban environments."
- Public–Private Partnerships (PPP) — "SATCO originates, develops, and participates in public–private partnership projects that advance the Kingdom's long-term development agenda. With a focus on non-recourse, project-financed structures, SATCO partners with government stakeholders together with global partners to deliver, operate, as well as sustain transformative infrastructure and giga-projects."

HOME — Careers teaser: "SATCO offers opportunities to work on complex, large-scale projects that support national development and long-term infrastructure performance. Our teams operate across diverse environments, delivering projects that demand technical excellence and operational discipline." — CTA "Explore career opportunities →"

HOME — Contact teaser: "Connect with SATCO to discuss partnerships, opportunities, or general inquiries." — CTA "Get in touch →"

SECTOR L2 — AIRPORTS:
Overview: "SATCO delivers integrated airport infrastructure systems and long-term operational solutions for some of the region's most demanding aviation environments. Combining deep technical expertise, large-scale execution capability, as well as long-standing partnerships with global system leaders, SATCO supports airports across the full asset lifecycle—from design and installation to operation, maintenance, including concession-based delivery. With proven experience in live-airport environments, SATCO is trusted to deploy, operate, and sustain mission-critical airside as well as terminal systems while maintaining uninterrupted airport operations."
Core Capabilities:
- Passenger Boarding & Aircraft Support Systems — "Passenger Boarding Bridges (PBBs), Pre-Conditioned Air (PCA), Hose Retrievers (HR), as well as 400Hz Ground Power Units (GPU), delivered in bridge-mounted, mobile, and stand-alone configurations. SATCO provides full lifecycle responsibility covering design, supply, installation, operation, and maintenance through strategic alignments with leading global OEMs."
- Airside & Apron Systems — "Advanced Visual Docking Guidance Systems (AVDGS), apron management systems, airfield lighting, and airside signage—supporting safe, precise aircraft movements as well as optimized apron operations."
- Terminal & Baggage Systems — "Turnkey delivery of baggage handling systems (BHS), conveyors, carousels, SCADA, RFID, and BRS platforms, alongside check-in counters, CUTE, FIDS, self-bag drop, and self-check-in solutions. SATCO integrates associated civil, MEP, and systems works within live terminal environments."
- Cargo & Automated Storage — "Design and delivery of air cargo handling as well as automated storage systems, developed in collaboration with international technology partners to support efficient airport logistics operations."
Delivery Models: "SATCO operates across flexible commercial and delivery models, including Design–Build, DBFOM, BOT, and BTO structures—enabling alignment with airport authorities, concession frameworks, as well as long-term operational requirements."
Selected Experience: "SATCO has delivered, operated, and maintained airport systems across Saudi Arabia and internationally. Experience includes long-term BOT concessions at King Khalid International Airport (Riyadh), Tabuk, and Arar airports; major system deployments at King Abdulaziz International Airport (Jeddah); and delivery of baggage handling systems and aircraft terminal interfaces across multiple domestic airports. SATCO has installed over 130 Passenger Boarding Bridges across the Kingdom's airports. Internationally, SATCO has executed airport systems at Blaise Diagne International Airport in Senegal. Today, SATCO continues to deploy and operate PBBs, GPUs, PCA, VDGS, as well as BHSs under multi-year concession and O&M agreements." + a **disabled** "Full project details →" link (a future Projects page).
Why SATCO in Airports: "SATCO is distinguished by its ability to execute in live, high-traffic airport environments, operate and maintain legacy systems beyond OEM support, as well as partner effectively with global aviation system leaders—supported by deep concession and long-term O&M expertise."

ABOUT (L1) — intro: "SATCO is a Saudi-owned infrastructure and services group operating across construction, airport infrastructure, operations as well as support services, and public–private partnerships. Established in 1975, SATCO supports complex projects that require scale, reliability, and long-term commitment." Four cards: Company Information ("An overview of SATCO's history, evolution, and integrated operating model.") · Key People & Leadership ("The leadership team guiding SATCO's strategy, governance, and long-term direction.") · Classifications, Licenses & Certifications ("SATCO's regulatory classifications and internationally recognized certifications.") · Clients ("Organizations that have trusted SATCO across its operating sectors and delivery models.")

CERTIFICATIONS page content: Government Classifications — SATCO is Category 1 across: General construction · Operations and maintenance services · Hard and Soft Landscaping · Catering and food services. Licenses — GACAR Part 151 (airside and apron operations across airports in the Kingdom). ISO — 9001:2015 Quality Management · 10002:2018 Customer Satisfaction & Complaints Handling · 14001:2015 Environmental Management · 45001:2018 Occupational Health & Safety · 55001:2014 Asset Management. LEED — SILVER, Green Building Rating System Certificate for its Laydown Offices in Neom.

KEY PEOPLE: content is pending — render a grid of placeholder person cards marked "Content coming soon."

## 8. Clients page — **LOCKED SPEC (client instructions)**
Optional subline: "Organizations that have trusted SATCO across its operating sectors and delivery models."
Build **three stacked sections, top to bottom**:

**1) Selected Clients (logos)** — purpose: immediate credibility and visual authority.
- Section label must be exactly **"Selected Clients"** — *do not* use "All Clients".
- **18–24 logos** (sweet spot); **absolute max 30 — do not exceed**. Mobile shows the same logos in a responsive grid.
- **Grid: 6 columns desktop · 3 tablet · 2 mobile.**
- **Monochrome / grayscale logos only.**
- **Equal visual weight — normalize heights.**
- **No links on logos** (*"avoid endorsement optics"*).
- **No animation beyond a subtle fade-in on scroll.**
- Use ~20 grayscale placeholder logo tiles with plausible generic labels (e.g. "Authority", "Airport Co.", "Giga-project sponsor") — clearly placeholders, uniformly sized.

**2) Full Client List (searchable, text-only)** — purpose: completeness without clutter.
- **Alphabetical A–Z**, **text-only names**, no logos, **no bullets**, clean typography.
- **Search field at the top, labelled "Search clients"** — **fast client-side filtering** as you type.
- **Two columns desktop, one column mobile.** Unlimited length (long-tail and historical clients live here).
- Populate with ~60 placeholder names spanning A–Z so the search visibly works. Show a count and an empty state ("No clients match that search").
- Sector and Geography filters are future-proofing — **do not build them now**.

**3) Legal disclaimer** — once, small, at the bottom. **Use verbatim:**
"Client names and logos are the property of their respective owners and are used for identification purposes only. Their inclusion does not imply endorsement, sponsorship, or an ongoing relationship unless expressly stated."

## 9. Careers + Job Detail — **LOCKED SPEC (client instructions)**
Filter facets: Keyword, Location, Operating Sector, Discipline / Function, Experience Level — all wired to the mock list with live client-side filtering, a result count, and an empty state.

Mock jobs (placeholders — the live source will be the **LinkedIn Jobs API or the internal ATS**):
- Senior Project Manager – Construction — Saudi Arabia — Construction
- Facilities Management Engineer — KSA / Regional — Integrated Operations & Support Services
- Airport Systems Technician — KSA — Airport Infrastructure & Operations
Add ~5 more plausible roles across the four sectors so the filters are demonstrable.

**Every job must open a real Job Detail view** containing, in this order: **Role summary · Responsibilities · Requirements · Location · Apply button**. Write plausible placeholder content for each. **No PDF downloads and no email-only workflows** — the apply action is a button to an ATS/LinkedIn URL. Include a back link to the listings.

**Tone rules (binding on any copy you write here):** no "family", no "rockstars", no exaggerated culture claims. Focus on work, scale, and professionalism.

General Applications CTA: "Submit your profile →".

## 10. Contact page
Standard corporate layout: form + contact details + map placeholder.
**Include an inquiry-type selector** routing to the right department — this is a live client proposal awaiting sign-off, so build it and mark it subtly as a proposal: **Discuss partnerships** (Info + Business Development) · **Opportunities** (Info + Business Development) · **Procurement** (Info + Procurement) · **Careers** (HR) · **General inquiries** (Info). Show the routing destination as helper text under the selector so reviewers can judge it.

## 11. Image handling (no external files)
For every photo, render an elegant placeholder: a solid/subtle two-tone stone-or-bronze block with a small centered outline icon and a caption naming the intended subject — e.g. "Airport apron — passenger boarding bridges", "NEOM construction village", "Facilities management team". The hero needs **4 strong sector images** — make those placeholders feel deliberate and art-directed, with a bronze→ink scrim so overlaid text stays legible. Keep all placeholders easy to swap later.

## 12. Signature interactions (must actually work)
1. **Loading intro** per §6A, plus the timing comparison control.
2. **Hero carousel** — 4 slides, "Explore →" navigates to that sector's L2. Auto-advance ~6s, pause on hover/focus, prev/next + dots, arrow keys, aria-live announcements, aria-roledescription="carousel".
3. **Stat count-up** — 0→target once on scroll-into-view; animate only the number, preserve suffixes; tabular figures; stat #3 has no figure — show a placeholder.
4. **Client search** — instant client-side filtering of the A–Z directory.
5. **Job filters + job detail navigation.**
6. **Scroll reveal** — sections fade + rise ~20px on entry (once), children staggered ~80ms. Client logos: fade-in only, nothing more.
7. **Nav dropdowns + mobile menu** per §5.
8. **prefers-reduced-motion** — skips the intro entirely, disables autoplay, shows final stat values, makes reveals instant.

## 13. Responsive (mobile-first)
Breakpoints 640 / 768 / 1024 / 1280. Reflow: nav → hamburger below 768; hero stacks (image over text) on phones; stat band 6 → 3×2 → 2×3; sector/About cards 4 → 2 → 1; **client logos 6 → 3 → 2**; **client directory 2 → 1**; L2 capability blocks 2-col → single-column tap-to-expand accordions; contact form + details side-by-side → stacked; footer multi → stacked. **Touch targets ≥ 44×44px, ≥ 8px apart; no hover-only actions.** Fluid clamp() sizing, no fixed widths. Respect OS zoom. No horizontal scroll at 390 / 768 / 1280px.

## 14. Accessibility (WCAG 2.1 AA)
Semantic landmarks (header/nav/main/footer), one h1 per screen, correct heading order, real lists for stats/capabilities/clients, buttons vs links used correctly. Fully keyboard operable (dropdowns, carousel, mobile menu, search, filters, form) with visible bronze focus rings and a skip link. Label placeholders meaningfully (client tiles "{name} logo"; decorative aria-hidden). The palette is pre-verified AA — keep body stone-700/white (7.4:1), links/headings bronze-800/white (8.67:1), white on bronze-800 (8.67:1). Never convey meaning by colour alone. The client search must announce result counts to screen readers (aria-live).

## 15. Output and acceptance criteria
Deliver **one self-contained .html file**. Done when:
- the intro plays **once at 1.2s as a pure fade** (300/600/300), then Home — and the review control can replay it at 1.2 / 1.5 / 2 / 3s;
- reduced-motion **skips the intro entirely**;
- nav, both dropdowns, and the mobile hamburger all navigate; there is **no "My SATCO"/login tab**;
- the hero carousel autoplays, pauses on hover/focus, and responds to prev/next, dots, and arrow keys;
- the six stats count up on scroll and stat #3 shows no invented number;
- the Clients page shows a **grayscale, unlinked 6/3/2 logo grid labelled "Selected Clients"** plus a **working searchable A–Z text directory** and the verbatim disclaimer;
- every job opens a **detail view** with summary / responsibilities / requirements / location / apply;
- no horizontal scroll at 390 / 768 / 1280px;
- a keyboard-only pass reaches every control with a visible focus ring;
- only the approved bronze/stone tokens and Archivo/Inter are used.

Build it now, then give me a two-line summary of what you built and any assumptions you made.
