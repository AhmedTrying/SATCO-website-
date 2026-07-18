/*
 * Zod schemas — runtime validation for dashboard writes (kickoff §2.1, §3).
 * Every privileged write validates against these before it is persisted, so the
 * dashboard can never produce a shape the site can't render. Kept structurally
 * identical to the TypeScript interfaces in ./types and ./content.
 *
 * Copy-discipline note: string fields are validated for PRESENCE only, never
 * transformed — no trimming of meaningful whitespace, no "smart quotes", nothing
 * that would mutate verbatim copy (em-dashes, "as well as", U+2019 apostrophes).
 */

import { z } from "zod";

export const sectorSlugSchema = z.enum([
  "airports",
  "construction",
  "operations",
  "ppp",
]);

export const ctaLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const imageRefSchema = z.object({
  src: z.string(),
  // Alt is required by policy; empty string is allowed ONLY for decorative images.
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  credit: z.string().optional(),
});

export const capabilitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const deliveryModelSchema = z.object({
  models: z.array(z.string().min(1)),
  heading: z.string().min(1),
  description: z.string().min(1),
  secondary: z
    .object({ title: z.string().min(1), body: z.string().min(1) })
    .optional(),
});

export const selectedExperienceSchema = z.object({
  status: z.enum(["confirmed", "pending-decision"]),
  body: z.string(),
  projectsLink: ctaLinkSchema.optional(),
});

export const sectorSchema = z.object({
  slug: sectorSlugSchema,
  name: z.string().min(1),
  shortName: z.string().min(1),
  tagline: z.string().min(1),
  overviewShort: z.string().min(1),
  overview: z.string().min(1),
  capabilities: z.array(capabilitySchema),
  capabilitiesProse: z.string().optional(),
  delivery: deliveryModelSchema,
  experience: selectedExperienceSchema,
  experienceHeading: z.string().optional(),
  whySatco: z.string().min(1),
  whyLabel: z.string().min(1),
  mobileSummary: z.string().min(1),
  mobileCta: z.string().min(1),
  hero: imageRefSchema,
  heroPosition: z.string().optional(),
  card: imageRefSchema,
  gallery: z.array(imageRefSchema).optional(),
  contactCta: z.string().min(1),
  order: z.number().int(),
});

export const statSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  // null is intentional — stat #3 has no figure yet; NEVER invent one.
  value: z.number().nullable(),
  display: z.string(),
  suffix: z.string().optional(),
  unit: z.string().optional(),
  decimals: z.number().optional(),
  countUp: z.boolean().optional(),
});

export const classificationSchema = z.object({
  category: z.string().min(1),
  activities: z.array(z.string().min(1)),
});

export const licenseSchema = z.object({
  name: z.string().min(1),
  scope: z.string().min(1),
});

export const certificationSchema = z.object({
  code: z.string().min(1),
  title: z.string().min(1),
  group: z.enum(["iso", "leed", "other"]),
  note: z.string().optional(),
  image: imageRefSchema.optional(),
});

export const clientSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tier: z.enum(["selected", "directory"]),
  logo: imageRefSchema.optional(),
  sector: z.array(sectorSlugSchema).optional(),
  geography: z.string().optional(),
});

export const leadershipMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().optional(),
  photo: imageRefSchema.optional(),
  order: z.number().int(),
});

export const experienceLevelSchema = z.enum([
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
]);

export const jobSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  sector: sectorSlugSchema,
  discipline: z.string().min(1),
  experienceLevel: experienceLevelSchema,
  type: z.enum(["full-time", "contract"]).optional(),
  postedAt: z.string().optional(),
  summary: z.string().min(1),
  responsibilities: z.array(z.string().min(1)),
  requirements: z.array(z.string().min(1)),
  // Apply URL — never a PDF or mailto (docx comment #42).
  applyHref: z
    .string()
    .url()
    .refine((v) => !v.startsWith("mailto:") && !/\.pdf($|\?)/i.test(v), {
      message: "Apply link must be a live ATS/LinkedIn URL — not a PDF or email.",
    }),
  source: z.enum(["mock", "linkedin", "ats"]),
});

export const jobStateSchema = z.enum(["draft", "open", "closed"]);

export const jobRecordSchema = jobSchema.extend({
  state: jobStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ------------------------------- Site & flags ---------------------------- */

export const siteContentSchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  established: z.number().int(),
  location: z.string().min(1),
  // Frozen by client sign-off (docx comment #2).
  loadingText: z.literal("Celebrating over 50 years of excellence"),
  description: z.string().min(1),
  copyrightHolder: z.string().min(1),
  establishedLine: z.string().min(1),
  contact: z.object({
    addressLines: z.array(z.string()),
    email: z.string().email(),
  }),
  flags: z.object({ showVendorsTab: z.boolean() }),
});

export const featureFlagsSchema = z.object({
  // Loading duration is capped at 1500ms (docx comment #2) — enforced here.
  loading_duration_ms: z.number().int().min(300).max(1500),
  show_review_control: z.boolean(),
  show_vendor_tab: z.boolean(),
  show_pending_experience: z.boolean(),
  section_visibility: z.object({
    statBand: z.boolean(),
    whoWeAre: z.boolean(),
    careersTeaser: z.boolean(),
    contactTeaser: z.boolean(),
  }),
  careers_source: z.enum(["dashboard", "linkedin", "ats"]),
  maintenance_banner: z.string().nullable(),
});

/* ------------------------------- Submissions ----------------------------- */

export const inquiryTypeSchema = z.enum([
  "partnerships",
  "opportunities",
  "procurement",
  "careers",
  "general",
]);

export const contactSubmissionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  inquiryType: inquiryTypeSchema,
  message: z.string().min(1),
  assignedDept: z.string(),
  status: z.enum(["new", "in-progress", "handled", "archived"]),
  assignee: z.string().optional(),
  createdAt: z.string(),
});

/* ------------------------------- Media ----------------------------------- */

export const mediaItemSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  filename: z.string().min(1),
  // Alt text required (a11y). Non-empty enforced at the upload form for public media.
  alt: z.string(),
  bucket: z.enum(["public-media", "private-uploads"]),
  mimeType: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().optional(),
  height: z.number().optional(),
  category: z.enum(["logo", "certificate", "photo", "cv", "other"]).optional(),
  uploadedAt: z.string(),
  uploadedBy: z.string(),
});

/* ------------------------------- Users ----------------------------------- */

export const roleSchema = z.enum(["viewer", "editor", "publisher", "admin"]);

export const userAccountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  role: roleSchema,
  active: z.boolean(),
  createdAt: z.string(),
});
