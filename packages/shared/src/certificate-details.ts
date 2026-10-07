/** FIX-24 (Options B and C): details read off SATCO's actual ISO certificates,
 * as published on satco.sa (wp-content/uploads/2026/03/ISO.jpg, cropped per
 * certificate into each option's public/certificates/). Keyed by the
 * certification `code` in the dashboard content. The LEED certificate (supplied
 * 2026-10-01) is in `leedCertificates` below. */
export const certificationBodies = {
  intertek: {
    name: "Intertek",
    logo: "/certificates/logos/intertek.svg",
    accreditation: "UKAS accredited",
  },
  "bureau-veritas": {
    name: "Bureau Veritas",
    logo: "/certificates/logos/bureau-veritas.png",
    accreditation: "UKAS accredited",
  },
  tnv: {
    name: "TNV",
    logo: "/certificates/logos/tnv.png",
    accreditation: "UAF accredited",
  },
} as const;

export type CertificationBodyId = keyof typeof certificationBodies;

/** Logos for the non-ISO credentials. GACA: the official dual-colour logo from
 * GACA's media kit (gaca.gov.sa/en/Media-Kit). LEED: USGBC's "LEED certified
 * project" badge from its digital badges package for certified projects
 * (usgbc.org/leed/tools/project-promotion); the LEED Silver mark itself must
 * be requested from USGBC marketing. */
export const credentialLogos = {
  license: {
    "GACAR Part 151": {
      src: "/certificates/logos/gaca.svg",
      alt: "General Authority of Civil Aviation (GACA)",
    },
  } as Record<string, { src: string; alt: string }>,
  leed: {
    src: "/certificates/logos/leed-certified-project.jpg",
    alt: "LEED certified project",
    issuer: "USGBC",
  },
};

export interface CertificateDetail {
  issuer: CertificationBodyId;
  /** ISO date the certificate expires ("valid until" / "expires on"). */
  validUntil: string;
  /** File stem under /certificates/: `${file}.jpg` full size, `${file}-480.{webp,jpg}` thumbnail. */
  file: string;
}

export const certificateDetails: Record<string, CertificateDetail> = {
  "ISO 9001:2015": { issuer: "intertek", validUntil: "2027-06-01", file: "iso-9001-2015" },
  "ISO 10002:2018": { issuer: "bureau-veritas", validUntil: "2028-09-14", file: "iso-10002-2018" },
  "ISO 14001:2015": { issuer: "bureau-veritas", validUntil: "2028-03-15", file: "iso-14001-2015" },
  "ISO 45001:2018": { issuer: "bureau-veritas", validUntil: "2028-10-22", file: "iso-45001-2018" },
  "ISO 55001:2014": { issuer: "tnv", validUntil: "2029-02-25", file: "iso-55001-2014" },
};

/** FIX-24: SATCO's LEED certificate, supplied as a PDF on 2026-10-01 and read
 * off it verbatim. It prints a certification month but no expiry, so it shows
 * "Certified August 2025", never a "valid until". Files under /certificates/:
 * `${file}.jpg` full size, `${file}-480.{webp,jpg}` thumbnail, `${file}.pdf`
 * the original (the download). Keyed by the certification `code`. */
export interface LeedCertificate {
  project: string;
  location: string;
  ratingSystem: string;
  level: string;
  /** Month the certificate was awarded, as printed ("August 2025"). */
  certified: string;
  certifiedBy: string;
  file: string;
  /** Pixel size of the thumbnail (landscape certificate). */
  thumb: { width: number; height: number };
}

export const leedCertificates: Record<string, LeedCertificate> = {
  "LEED — Silver": {
    project: "NEOM SATCO Laydown Office",
    location: "Neom, Saudi Arabia",
    ratingSystem: "LEED v4.1 Operations and Maintenance: Existing Buildings",
    level: "Silver",
    certified: "August 2025",
    certifiedBy: "U.S. Green Building Council & Green Business Certification Inc.",
    file: "leed-silver-2025",
    thumb: { width: 480, height: 383 },
  },
};

/** "2027-06-01" → "1 June 2027" (fixed locale, so the static export is stable). */
export function formatCertificateDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

export const certificateCopy = {
  issuedBy: "Issued by",
  validUntil: "Valid until",
  view: "View certificate",
  download: "Download",
  newTab: "(opens in a new tab)",
  certified: "Certified",
  bodiesHeading: "Certified by",
  registerIssuer: "Issuer",
  registerValid: "Valid until",
  registerCertificate: "Certificate",
};
