/*
 * The comparison list for the A/B/C review board.
 * One entry per deliberate difference between the options, in meeting order.
 * Source of truth for what differs: docs/VARIANTS.md (superseded rows excluded).
 *
 * Fields
 *   id       stable key (votes/decisions are stored under it — don't rename after a meeting)
 *   group    rail heading
 *   title    item name
 *   path     path (with hash/query) loaded in every option, or { A, B, C } per option
 *   differs  one line per option, shown above the frames
 *   hint     what the presenter should do inside the frame (hover, scroll, click)
 *   motion   true → defaults to single view and shows the replay hint
 *   ref      feedback-tracker ids, shown small
 */
window.SATCO_REVIEW_ITEMS = [
  {
    id: "intro",
    group: "Home",
    title: "Intro (loading screen)",
    path: "/?intro=1",
    motion: true,
    ref: "OPT-01",
    differs: {
      A: "Lockup slides in from the left, holds, then the cream panel slides off to the right.",
      B: "Lockup rises into place while fading in, then the panel lifts off the top.",
      C: "Lockup fades in, then the screen splits down the middle and both halves slide away.",
    },
    hint: "Press R to replay all three. Switch 1 / 2 / 3 straight after a reload to compare.",
  },
  {
    id: "hero",
    group: "Home",
    title: "Home hero",
    path: "/",
    motion: true,
    ref: "FIX-16 · FIX-17",
    differs: {
      A: "Original eyebrow + headline above the slide text.",
      B: "No eyebrow or headline — each slide leads with its sector title, larger.",
      C: "Same slide-led text, plus the SATCO lockup in the hero that docks into the header on scroll.",
    },
    hint: "Scroll down and back up inside C to see the logo dock. Let the slides auto-advance.",
  },
  {
    id: "dropdowns",
    group: "Home",
    title: "Header dropdowns",
    path: "/",
    ref: "OPT-02",
    differs: {
      A: "Plain light panel.",
      B: "Frosted glass — white at 70% with a backdrop blur.",
      C: "Dark translucent — footer charcoal at 85%, near-white links.",
    },
    hint: "Hover “About us” or “Operating sectors” in the header inside the frame.",
  },
  {
    id: "stats",
    group: "Home",
    title: "Proven at scale (stats)",
    path: "/#stat-h",
    ref: "OPT-03 · FIX-05 · FIX-18",
    differs: {
      A: "Two groups with the line-drawing illustrations.",
      B: "One consolidated six-stat panel, 3 × 2, no illustrations.",
      C: "Real SATCO construction and airport photos head each group.",
    },
  },
  {
    id: "who-we-are",
    group: "Home",
    title: "Who we are",
    path: "/#who-h",
    ref: "FIX-06 · FIX-07",
    differs: {
      A: "Text beside a photo with the “Established 1975” badge.",
      B: "“Panorama” — wide photo band with parallax, white card, 1975 set large beside it.",
      C: "“Mosaic and seal” — 2 × 2 sector photo mosaic with a slowly turning Established-1975 seal.",
    },
  },
  {
    id: "sectors-band",
    group: "Home",
    title: "Operating sectors band",
    path: "/#sectors-h",
    ref: "FIX-19 · FIX-08",
    differs: {
      A: "Near-black band.",
      B: "Sector-page brown (bronze-950) with a soft top glow.",
      C: "Same brown at the top, deepening to the footer charcoal at the foot.",
    },
  },
  {
    id: "spacing",
    group: "Home",
    title: "Homepage section spacing",
    path: "/#stat-h",
    ref: "spacing example",
    differs: {
      A: "Original section padding (the stats-to-intro gap reaches ~224px).",
      B: "Moderate — 40–64px padding, gap ≤ 128px.",
      C: "Compact — 32–48px padding, gap ≤ 96px.",
    },
    hint: "Use side-by-side (S) and scroll each frame from the stats down to Who we are.",
  },
  {
    id: "contact-band",
    group: "Home",
    title: "Connect with SATCO band",
    path: "/#contact-teaser-h",
    ref: "OPT-04",
    differs: {
      A: "Cream band with a top border.",
      B: "Solid deep bronze-brown, white heading, light button.",
      C: "Footer charcoal with the Riyadh skyline continuing up from the footer, thin bronze divider.",
    },
    hint: "Scroll to the very bottom so the band sits above the footer.",
  },
  {
    id: "photography",
    group: "Global",
    title: "Photography direction",
    path: "/sectors/airports/",
    ref: "DEC — stock vs real vs AI",
    differs: {
      A: "Stock photography (Unsplash).",
      B: "SATCO's own photos from the client's folder, same slots.",
      C: "AI-generated imagery trial (docs/AI-IMAGE-BRIEF.md), same slots.",
    },
    hint: "Also visible on the home page, Careers and the other sector pages.",
  },
  {
    id: "about-header",
    group: "About",
    title: "About us header",
    path: "/about/",
    ref: "FIX-20 · FIX-44",
    differs: {
      A: "Plain sand page header with the three intro paragraphs; cards say “Explore”.",
      B: "“The record” — deep bronze band, giant outlined 1975, the record sentence as a four-cell ledger.",
      C: "“Build, then operate” — charcoal band with a draggable before/after of a community being built.",
    },
    hint: "In C, drag the bronze divider. B and C also use the document's card labels (View Company Information …).",
  },
  {
    id: "leadership",
    group: "About",
    title: "Key people",
    path: "/about/leadership/",
    ref: "OPT-05 · FIX-22",
    differs: {
      A: "Name + title cards (no biographies).",
      B: "Compact alternating portrait / text rows with the document biographies.",
      C: "The document's 7 people under Chairman / Leadership Team, one card style, full bios open.",
    },
    hint: "Portrait placeholders until the photographer delivers.",
  },
  {
    id: "certifications",
    group: "About",
    title: "Certifications",
    path: "/about/certifications/",
    ref: "FIX-23 · FIX-24 · FIX-25",
    differs: {
      A: "Original layout, icon placeholders, “Ongoing compliance” block at the end.",
      B: "Gallery — five certificate thumbnails + LEED band with View / Download; no “Ongoing compliance”.",
      C: "Register — “Certified by” strip, then a table of certificates with issuer, validity, View / Download.",
    },
  },
  {
    id: "clients",
    group: "About",
    title: "Clients",
    path: "/about/clients/",
    ref: "FIX-15 · DEC-03",
    differs: {
      A: "Dec-2025 spec — Selected clients logos, full list, sector filter chips.",
      B: "Logo wall — one alphabetical grid of logo + name tiles, live search, no filters.",
      C: "A–Z index — dark hero, sticky letter bar, letter groups with logo plates.",
    },
    hint: "Sample list in all three until the final logo list is applied.",
  },
  {
    id: "capabilities",
    group: "Sectors",
    title: "Sector page — Core capabilities",
    path: "/sectors/construction/",
    ref: "sector pages",
    differs: {
      A: "Numbered capability cards (accordion on phones).",
      B: "Staircase — titled prose blocks behind a bronze rule, stepping across the grid.",
      C: "Same staircase as B.",
    },
    hint: "Scroll to “Core capabilities”. Same on Airports, Operations and PPP.",
  },
  {
    id: "experience",
    group: "Sectors",
    title: "Sector page — Selected experience & gallery",
    path: "/sectors/construction/",
    ref: "plan §12 Q4",
    differs: {
      A: "Interim “experience to follow” card and a single image.",
      B: "Same as A.",
      C: "Draft experience text published, figure cards + card photo, 3-image mosaic gallery.",
    },
    hint: "Scroll below Core capabilities. Tamer's case studies will replace the draft text.",
  },
  {
    id: "careers-hero",
    group: "Careers",
    title: "Careers hero & structure",
    path: "/careers/",
    ref: "Suggested Careers copy",
    differs: {
      A: "Rebuilt on the client's Suggested Careers copy — “Build your career with SATCO”, value, contribute, people, hire, register.",
      B: "“People wall” — sand editorial hero, values quote card, staggered photo strip; old sections kept.",
      C: "“Choose your sector” — charcoal hero, values statement, four-tile sector photo bento; old sections kept.",
    },
  },
  {
    id: "careers-list",
    group: "Careers",
    title: "Current opportunities list",
    path: "/careers/#roles-h",
    ref: "careers list",
    differs: {
      A: "Every matching role in one column, no paging.",
      B: "First 10 roles, then a “Show more roles (n)” button reveals the next 10 in place.",
      C: "10 per page with numbered pages (← Previous · 1 2 3 · Next →).",
    },
    hint: "B's and C's controls only appear when the dashboard feed has more than 10 live roles.",
  },
  {
    id: "contact",
    group: "Contact",
    title: "Contact page",
    path: "/contact/",
    ref: "FIX-30 · FIX-33",
    differs: {
      A: "Office locator — Riyadh / Al Jubail tabs over a map-led panel beside the form.",
      B: "“Two cities” — bronze band with both offices side by side, then the form beside a switchable map.",
      C: "Split screen — form on sand, map edge to edge with a glass office bar along its foot.",
    },
    hint: "Switch offices in each option.",
  },
];
