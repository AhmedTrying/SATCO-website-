import { contactPage } from "@/content/contact";
import { footerContent, site } from "@/content/site";

/*
 * SATCO's two offices (Riyadh head office, Al Jubail branch) for the
 * contact page's office locator (FIX-33). Jeddah removed 2026-10-04 (client).
 * The same file in Options A, B and C — port any change to all three.
 *
 * The shared content model has no `offices` concept (site.contact holds one
 * address), so this is a site-local presentation file in the same spirit as
 * footerContent in content/site.ts. When the branches need to be publishable,
 * this moves into @satco/shared with a dashboard editor.
 *
 * Nothing here is invented: the head office reads from the published content
 * (the letterhead address, phone and fax) plus its National Address short
 * code (proof 1084964481), and Al Jubail is transcribed from
 * the National Address proof 1094807037 (issued 30/9/2026, registered
 * 2/4/2026) with the branch phone the client supplied on 2026-10-04.
 */

export interface Office {
  id: string;
  /** Tab label — the city, so the offices read as peers */
  city: string;
  /** Row label in the details list */
  name: string;
  /** null = not supplied yet; the UI shows a pending state instead */
  addressLines: string[] | null;
  /** Saudi National Address short code, where we hold the proof */
  shortAddress: string | null;
  postalCode: string | null;
  /** null = no branch line supplied; the UI says so rather than repeating another office's */
  phone: string | null;
  /** Shown under the phone as reference text (not a tel: link) */
  fax: string | null;
  email: string;
  hours: string | null;
  /** Keyless Google embed; null renders the designed map placeholder */
  mapEmbedUrl: string | null;
  /** Accessible name / caption for the map slot */
  mapLabel: string;
  mapCaption: string;
  /** Shown in place of the address while the office is pending */
  pendingNote: string | null;
}

const d = contactPage.details;

/** Row labels — the published contact-page labels, so the wording stays in content. */
export const officeLabels = {
  phone: d.phoneLabel,
  // Bundles published before FIX-33 carry no fax label.
  fax: d.faxLabel ?? "Fax",
  email: d.emailLabel,
  hours: d.hoursLabel,
  directions: footerContent.directionsLabel,
  shortAddress: "Short address",
  pending: "To be provided",
  // Option B "two cities": the band's map buttons and the map switch
  showOnMap: "Show on map",
  mapSwitch: "Office shown on the map",
} as const;

export const offices: Office[] = [
  {
    id: "riyadh",
    city: "Riyadh",
    name: d.officeLabel,
    // Published content (letterhead details) — shared by A, B and C.
    addressLines: site.contact.addressLines,
    // National Address proof 1084964481 (issued 28/4/2026): building 9259,
    // Wadi Al Thumamah, secondary 2504, Al Olaya Dist., Riyadh 12214. The
    // published address lines (letterhead, P.O. Box 11411) are left as they are.
    shortAddress: "RHOC9259",
    postalCode: "12214",
    phone: d.phone,
    fax: d.fax ?? null,
    email: site.contact.email,
    hours: d.hours,
    mapEmbedUrl: contactPage.mapEmbedUrl ?? null,
    mapLabel: contactPage.mapLabel,
    mapCaption: contactPage.mapCaption,
    pendingNote: null,
  },
  {
    id: "jubail",
    city: "Al Jubail",
    name: "Al Jubail branch",
    // National Address proof 1094807037: building 7496, secondary 3328.
    addressLines: [
      "Al Souq St., Al Fayha Dist.",
      "Building 7496, Al Jubail 35811",
      "Kingdom of Saudi Arabia",
    ],
    shortAddress: "ETAE7496",
    postalCode: "35811",
    // Branch line supplied by the client 2026-10-04 (confirmed active).
    phone: "+966 13 340 4982",
    fax: null,
    email: site.contact.email,
    hours: d.hours,
    /* The branch's own Google Maps place, "SATCO - JUBAIL" (pin supplied by
       the client 2026-10-04, maps.app.goo.gl/nx1g9sDNyg5pHU2e8 →
       27.1231043, 49.5525477), embedded by CID like the head office. */
    mapEmbedUrl: "https://maps.google.com/maps?cid=15586636628627158344&hl=en&output=embed",
    mapLabel: "SATCO Al Jubail branch on Google Maps — Al Fayha, Al Jubail, Saudi Arabia",
    mapCaption: "Map — Al Jubail, KSA",
    pendingNote: null,
  },
];
