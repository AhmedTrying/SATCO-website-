# SATCO website — AI image brief

Every photo slot on the site, which section it belongs to, what it shows now, and a prompt for generating a replacement.
All slots below use **Option A** (`satco-web`). B and C use the same image files.

---

## 1. Rules for every image (put these in each prompt, or in your tool's "style" setting)

**Style block** — paste at the end of every prompt:

> Photorealistic editorial corporate photography, Saudi Arabia, warm golden-hour desert light, clean and uncluttered composition, muted palette of warm stone, sand and concrete greys with bronze-amber accents (#C0720C), shallow haze, high dynamic range, shot on a full-frame camera, 35mm lens, no text, no watermarks, no other company logos.

**People and uniforms (the logo)**
- Uniform: charcoal-grey or navy coveralls / work shirts, with the **SATCO logo on the left chest** and a small logo on the front of a **white hard hat**. Orange-bronze hi-vis vests with reflective stripes, safety glasses, gloves and boots. PPE must be correct in every shot (the client is a contractor, and wrong PPE will be noticed).
- Engineers and managers: white or light-blue shirt with the logo on the chest, white hard hat, bronze vest.
- Workforce: a realistic mix of Saudi and multinational staff. Saudi staff may wear a ghutra under a hard hat only where that is realistic. Everyone modestly dressed.
- **Logo tip:** AI generators usually distort logos. Generate with a **plain rectangular chest patch / blank hard-hat decal**, then add the real logo (`Images/Logo.jpg`, bronze sun over grey land) afterwards in Photoshop, Canva or an AI editor that accepts a reference image (for example Gemini, GPT image edit, or Firefly "reference image"). Check the logo on every final image.

**Things to avoid**
- No real airline, airport or client branding (Saudia, GACA, NEOM, etc.). Aircraft should be plain white or generic livery. Some current photos show the Saudia livery; replacements should not.
- No readable signs or text (AI text looks fake).
- No invented landmarks that look like specific real projects.

**Output size**
- Hero images: **at least 2400 px wide**, landscape **16:9** (safe area in the middle, because the site crops the top and bottom).
- Cards and gallery images: **at least 1600 px wide**, **4:3** landscape unless stated otherwise.
- Save as JPG. The developer then runs `scripts/optimize-images.mjs` to make the 640/1080/1600/2200 sizes.

---

## 2. Image list by section

### Home page

| # | Slot (file name) | Where it appears | Prompt |
|---|---|---|---|
| H1 | `construction-1` | Home › "Who we are" (large image with the "Established 1975" card) + Construction page hero | Wide shot of a large Saudi residential community under construction at golden hour: rows of villas at structural stage, tower cranes, and a small team of SATCO workers in charcoal coveralls with the logo on the chest and white logo hard hats walking in the foreground. Calm, confident, national scale. |
| H2 | `maintenance` | Home › Careers teaser + Careers page (small image) | Portrait (3:4). Close-up of a Saudi maintenance technician in a charcoal SATCO work shirt with the logo on the chest, white logo hard hat and safety glasses, inspecting electrical control panel equipment with a tablet. Focused expression, warm side light. |
| H3 | `proven-aviation.png` | Home › "Proven at scale" band, Aviation side | Line-art illustration (not a photo): a passenger boarding bridge connected to an aircraft nose, thin single-weight lines in bronze #C0720C on a transparent background, minimal architectural drawing style. Match the existing file. |
| H4 | `proven-communities.png` | Home › "Proven at scale" band, Communities side | Same line-art style as H3: a residential community of low-rise villas with palm trees, bronze lines on a transparent background. |

> The home hero slider reuses the four **sector hero** images (S1, C1, O1, P1 below).

### Sectors — Airports

| # | Slot | Where | Prompt |
|---|---|---|---|
| S1 | `airport-1` (hero) | Airports page hero + home slider | Modern Saudi airport apron at golden hour: a white widebody aircraft (no airline livery) docked to a glass passenger boarding bridge; the bridge has a small bronze SATCO logo panel on its side. Wide, cinematic, clear sky, heat haze. |
| S2 | `airport-4` (card) | Sectors overview card for Airports | A row of passenger boarding bridges along a modern terminal, seen from the apron, several generic white aircraft parked, SATCO logo on each bridge's rotunda. Clean symmetrical composition. |
| S3 | `airport-3` (gallery) | Airports gallery | Close view of a SATCO technician in charcoal coveralls with the chest logo and white logo hard hat connecting a 400Hz ground power unit cable and a yellow pre-conditioned-air hose to an aircraft under a boarding bridge. |
| S4 | `apron-1` (gallery) | Airports gallery | Ground crew in bronze hi-vis vests with the SATCO logo on the back, guiding a generic white aircraft with marshalling wands while a tow tractor waits. Low angle, evening light. |
| S5 | `tower-1` (gallery) | Airports gallery | Modern airport control tower rising above a terminal and jet bridge at dusk, warm sky, no signage. |
| S6 | *(new, optional)* `baggage-1` | Airports gallery (Terminal & baggage systems) | Inside a clean modern baggage handling hall: conveyors and a sorting line, one SATCO engineer in a light-blue logo shirt and white hard hat checking a SCADA screen. |

### Sectors — Construction

| # | Slot | Where | Prompt |
|---|---|---|---|
| C1 | `construction-1` (hero) | Same as H1 | See H1. |
| C2 | `construction-2` (card) | Sectors overview card + Careers page lower banner | Aerial drone view of a large Saudi community development under construction: road grid, villa foundations, site offices, tower cranes. Morning light, long shadows. |
| C3 | `construction-3` (gallery) | Construction gallery | Concrete high-rise frame under construction beside a tower crane; the crane counterweight carries a bronze SATCO logo. Workers in logo PPE visible on the upper floor slab. |
| C4 | `team-1` (gallery) | Construction gallery + Careers page (main image) | Three site engineers (Saudi and multinational) reviewing construction drawings on a tablet and a paper plan on the tailgate of a pickup; white logo hard hats, bronze vests with the SATCO logo, a building under construction behind them. |

### Sectors — Integrated operations & support services

| # | Slot | Where | Prompt |
|---|---|---|---|
| O1 | `ls-1` (hero) | Operations page hero + home slider | Well-kept residential community in Saudi Arabia: landscaped streets, palm trees, irrigated green verges, a SATCO facilities team in charcoal logo coveralls with a small white service vehicle carrying the SATCO logo on the door. |
| O2 | `plant-1` (card + gallery) | Sectors overview card + Operations gallery | Technician in SATCO logo coveralls and white logo hard hat inspecting pipework and gauges inside a clean industrial plant room (chillers / pumps), torch in hand. |
| O3 | `team-2` (gallery) | Operations gallery + Careers page hero background | Operations team of five in white logo hard hats and bronze logo vests having a morning safety briefing on site, supervisor holding a clipboard. |
| O4 | *(new, optional)* `landscape-1` | Operations gallery (Landscaping & irrigation) | Landscaping crew in SATCO logo uniforms planting palms and installing drip irrigation along a new boulevard at sunrise. |
| O5 | *(new, optional)* `catering-1` | Operations gallery (Community & life support) | Clean, bright workforce dining hall with staff in white chef uniforms with a small SATCO logo on the chest serving food. The `Images/Catering and FM` folder is empty, so this is a real gap. |

### Sectors — Public–private partnerships (PPP)

| # | Slot | Where | Prompt |
|---|---|---|---|
| P1 | `neom` (hero) | PPP page hero + home slider + About › Company page | Aerial view at golden hour of a large, modern, master-planned development in the Saudi desert: roads, community buildings, utilities, with mountains in the distance. Should look like SATCO's work, not a specific real project. |
| P2 | `highway-1` (card + gallery) | Sectors overview card + PPP gallery | Aerial top-down view of a large highway interchange in the desert near Riyadh at sunset, light traffic, clean geometry. |
| P3 | `riyadh-1` (gallery) | PPP gallery | Aerial view of a modern Saudi city skyline at dusk, warm light, no identifiable signage. |

### About

| # | Slot | Where | Prompt |
|---|---|---|---|
| A1 | `neom` | About › Company (story image) | Uses P1. Optionally make a separate image: a SATCO project manager in a light-blue logo shirt overlooking a completed community from a rooftop. |
| A2 | Leadership photos | About › Leadership | **Do not use AI.** These are real people and need real portraits. Brief for the photographer: light-stone background, soft window light, shoulders-up, dark suit or thobe, square (1:1) crop. |
| A3 | Certificates | About › Certifications | **Do not use AI.** Use scans of the real certificates. |
| A4 | Client logos | About › Clients | **Do not use AI.** Use the official logo files. |

### Careers

| # | Slot | Where | Prompt |
|---|---|---|---|
| K1 | `team-2` | Careers hero background | Uses O3. |
| K2 | `team-1` + `maintenance` | Careers "why join" pair | Uses C4 and H2. |
| K3 | `construction-2` | Careers lower banner | Uses C2. |
| K4 | `careers-role-line-art.png` | Job detail and apply pages (background) | Line-art in the same style as H3/H4: a hard hat, a blueprint and a crane outline, bronze lines on a transparent background, lots of empty space. |
| K5 | *(new, optional)* `graduates-1` | Careers | Young Saudi graduate engineers, men and women, in SATCO logo shirts and white hard hats, on a site walk with a senior mentor. |

### Contact and footer

| # | Slot | Where | Prompt |
|---|---|---|---|
| T1 | `riyadh-2` | Contact page details panel | Riyadh skyline at blue hour seen from a distance, soft and atmospheric, darker tones (white text will sit on top). |
| T2 | `footer-riyadh-skyline.webp` | Footer on every page | Wide panoramic silhouette of the Riyadh skyline, very low contrast, dark stone tones, lots of empty sky (it sits behind footer text). Aspect about 4:1. |

---

## 3. Priority

1. **Replace first:** `maintenance` (the current photo is small and low-res), all images showing the **Saudia livery** (`airport-1`, `airport-3`), and the stock Unsplash images (`team-1`, `team-2`, `plant-1`, `construction-2/3`), because these should show SATCO's uniform and logo.
2. **Then:** the four sector heroes (S1, C1, O1, P1), because they also play in the home slider.
3. **Optional new images:** S6, O4, O5, K5.

## 4. Handing images back

Name each file with its slot name (for example `team-1.jpg`), put them in `Images/AI/`, and the developer will optimize them and update `lib/images.ts`. For new slots (S6, O4, O5, K5), the gallery entry has to be added in the dashboard, with a new alt text.

**Alt text note:** some current alt texts claim the photo shows real SATCO work (for example "SATCO passenger boarding bridges on an airport apron"). If an AI image replaces a real photo, the alt text should describe the image without claiming it is a real SATCO project.
