/*
 * Seed generator — builds satco-admin/data/seed/*.json from the site's existing
 * content/*.ts (dashboard kickoff DA1: "seed local stores from satco-web/content").
 *
 * Run with:  npm run seed   (from repo root; uses tsx)
 *
 * The content/*.ts modules only `import type` from @/lib/types, so tsx/esbuild
 * erases those imports and loads them by relative path with no alias resolution.
 * Re-emitting the imported values as JSON guarantees byte-perfect fidelity with
 * the live site — the same bundle the DA3 Publish step will write.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULT_FLAGS } from "@satco/shared";
import type {
  AuditEntry,
  ContactSubmission,
  ContentBundle,
  GeneralApplication,
  JobApplication,
  JobRecord,
  MediaItem,
  UserAccount,
} from "@satco/shared";

// Site content (type-only imports inside these are erased by tsx).
import { site } from "../../satco-web/content/site.ts";
import { statPendingNote, stats } from "../../satco-web/content/stats.ts";
import { home } from "../../satco-web/content/home.ts";
import {
  footerColumns,
  footerContactColumn,
  primaryNav,
} from "../../satco-web/content/navigation.ts";
import { company } from "../../satco-web/content/company.ts";
import {
  certifications,
  certificationsPage,
  classifications,
  licenses,
} from "../../satco-web/content/certifications.ts";
import { clients, clientsPage } from "../../satco-web/content/clients.ts";
import { leadership, leadershipPage } from "../../satco-web/content/leadership.ts";
import { careersPage } from "../../satco-web/content/careers.ts";
import { contactPage } from "../../satco-web/content/contact.ts";
import {
  pendingExperienceCard,
  sectors,
  sectorsIntro,
  showPendingExperience,
} from "../../satco-web/content/sectors.ts";
import { jobs } from "../../satco-web/content/jobs.ts";

const here = dirname(fileURLToPath(import.meta.url));
const seedDir = join(here, "..", "data", "seed");
mkdirSync(seedDir, { recursive: true });

const now = new Date().toISOString();

/* ------------------------------------------------------------------ content */

const bundle: ContentBundle = {
  site,
  navigation: { primaryNav, footerColumns, footerContactColumn },
  home,
  statPendingNote,
  stats,
  sectorsIntro,
  showPendingExperience,
  pendingExperienceCard,
  sectors,
  company,
  certificationsPage,
  classifications,
  licenses,
  certifications,
  clientsPage,
  clients,
  leadershipPage,
  leadership,
  careersPage,
  contactPage,
  flags: DEFAULT_FLAGS,
};

/* --------------------------------------------------------------------- jobs */
// Seed the JobStore from the site's Job mock — all currently "open".
const jobRecords: JobRecord[] = jobs.map((j) => ({
  ...j,
  state: "open",
  createdAt: now,
  updatedAt: now,
}));

/* ------------------------------------------------------- mock inbox seeds */
// Clearly-synthetic sample data so the inboxes are demonstrable (kickoff §3).
const submissions: ContactSubmission[] = [
  {
    id: "sub-1001",
    name: "Layla Al-Harbi",
    email: "l.alharbi@example-developer.sa",
    organization: "Coastal Development Authority",
    inquiryType: "partnerships",
    message:
      "We are evaluating delivery partners for an availability-based PPP and would like to discuss SATCO's PPP track record.",
    assignedDept: "Business Development & Info",
    status: "new",
    createdAt: now,
  },
  {
    id: "sub-1002",
    name: "Omar Nasser",
    email: "omar.nasser@example-contractor.com",
    organization: "Nasser Trading Est.",
    inquiryType: "procurement",
    message:
      "Requesting vendor pre-qualification details for MEP subcontracting on upcoming construction packages.",
    assignedDept: "Procurement & Info",
    status: "in-progress",
    assignee: "publisher@satco.com.sa",
    createdAt: now,
  },
  {
    id: "sub-1003",
    name: "Fatimah Al-Qahtani",
    email: "fatimah.q@example-mail.com",
    inquiryType: "careers",
    message:
      "I have 8 years in facilities management and would like to understand current openings in your operations sector.",
    assignedDept: "Human Resources",
    status: "new",
    createdAt: now,
  },
  {
    id: "sub-1004",
    name: "David Chen",
    email: "d.chen@example-systems.com",
    organization: "Global Airport Systems",
    inquiryType: "opportunities",
    message:
      "Exploring OEM collaboration for passenger boarding bridges and 400Hz ground power across the Kingdom.",
    assignedDept: "Business Development & Info",
    status: "handled",
    assignee: "admin@satco.com.sa",
    createdAt: now,
  },
  {
    id: "sub-1005",
    name: "Sara Ibrahim",
    email: "sara.ibrahim@example.org",
    inquiryType: "general",
    message: "General question about SATCO's certifications and ISO scope.",
    assignedDept: "Info (general)",
    status: "new",
    createdAt: now,
  },
];

const applications: JobApplication[] = [
  {
    id: "app-2001",
    jobId: "spm-construction",
    jobTitle: "Senior Project Manager – Construction",
    applicantName: "Khalid Mansour",
    email: "k.mansour@example-mail.com",
    phone: "+966 55 123 4567",
    coverNote:
      "14 years delivering integrated communities; led a 25,000-resident NEOM village program.",
    status: "reviewing",
    createdAt: now,
  },
  {
    id: "app-2002",
    jobId: "airport-tech",
    jobTitle: "Airport Systems Technician",
    applicantName: "Yousef Al-Dossary",
    email: "yousef.d@example-mail.com",
    phone: "+966 50 987 6543",
    status: "new",
    createdAt: now,
  },
  {
    id: "app-2003",
    jobId: "ppp-analyst",
    jobTitle: "PPP Investment Analyst",
    applicantName: "Noura Saleh",
    email: "noura.saleh@example-mail.com",
    coverNote: "Project-finance background across MENA infrastructure.",
    status: "shortlisted",
    createdAt: now,
  },
];

const generalApplications: GeneralApplication[] = [
  {
    id: "gen-3001",
    applicantName: "Ahmed Farouk",
    email: "a.farouk@example-mail.com",
    phone: "+966 53 222 1111",
    discipline: "Electrical Engineering",
    sector: "operations",
    note: "Open to facilities and asset-operations roles across the Kingdom.",
    status: "new",
    createdAt: now,
  },
  {
    id: "gen-3002",
    applicantName: "Mariam Zayd",
    email: "mariam.zayd@example-mail.com",
    discipline: "Quantity Surveying",
    sector: "construction",
    status: "reviewing",
    createdAt: now,
  },
];

/* -------------------------------------------------------------------- media */
// Public brand photography already shipped by the site (lib/images.ts manifest),
// indexed here with required alt text so the Media library has real entries.
const media: MediaItem[] = [
  {
    id: "media-airport-1",
    path: "/images/airport-1-1080.jpg",
    filename: "airport-1-1080.jpg",
    alt: "A Saudia widebody aircraft docked to a SATCO passenger boarding bridge",
    bucket: "public-media",
    mimeType: "image/jpeg",
    sizeBytes: 0,
    category: "photo",
    uploadedAt: now,
    uploadedBy: "seed",
  },
  {
    id: "media-construction-1",
    path: "/images/construction-1-1080.jpg",
    filename: "construction-1-1080.jpg",
    alt: "Aerial view of a large SATCO integrated residential construction village",
    bucket: "public-media",
    mimeType: "image/jpeg",
    sizeBytes: 0,
    category: "photo",
    uploadedAt: now,
    uploadedBy: "seed",
  },
  {
    id: "media-ls-1",
    path: "/images/ls-1-1080.jpg",
    filename: "ls-1-1080.jpg",
    alt: "Aerial view of an institutional campus operated and maintained by SATCO",
    bucket: "public-media",
    mimeType: "image/jpeg",
    sizeBytes: 0,
    category: "photo",
    uploadedAt: now,
    uploadedBy: "seed",
  },
  {
    id: "media-neom",
    path: "/images/neom-1080.jpg",
    filename: "neom-1080.jpg",
    alt: "Aerial view of a giga-project development delivered under a long-term partnership",
    bucket: "public-media",
    mimeType: "image/jpeg",
    sizeBytes: 0,
    category: "photo",
    uploadedAt: now,
    uploadedBy: "seed",
  },
];

/* -------------------------------------------------------------------- users */
const users: UserAccount[] = [
  {
    id: "u-admin",
    name: "Amira Al-Rashid",
    email: "admin@satco.com.sa",
    role: "admin",
    active: true,
    createdAt: now,
  },
  {
    id: "u-publisher",
    name: "Bandar Al-Otaibi",
    email: "publisher@satco.com.sa",
    role: "publisher",
    active: true,
    createdAt: now,
  },
  {
    id: "u-editor",
    name: "Sultan Al-Ghamdi",
    email: "editor@satco.com.sa",
    role: "editor",
    active: true,
    createdAt: now,
  },
  {
    id: "u-viewer",
    name: "Tarek Hassan",
    email: "viewer@satco.com.sa",
    role: "viewer",
    active: true,
    createdAt: now,
  },
];

/* -------------------------------------------------------------------- audit */
const audit: AuditEntry[] = [
  {
    id: "audit-0001",
    ts: now,
    actor: "seed",
    action: "seed.init",
    entity: "system",
    summary: "Local stores seeded from satco-web/content.",
  },
];

/* ------------------------------------------------------------------- write */
function write(name: string, data: unknown) {
  const file = join(seedDir, name);
  writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("wrote", name);
}

write("content.json", bundle);
write("jobs.json", jobRecords);
write("submissions.json", submissions);
write("applications.json", applications);
write("general-applications.json", generalApplications);
write("media.json", media);
write("users.json", users);
write("audit.json", audit);

console.log("\nSeed complete →", seedDir);
