/*
 * Zod schemas for the page-copy sections (admin-side companions to the entity
 * schemas in @satco/shared/schemas). Presence-only validation — copy is never
 * transformed (verbatim-copy discipline, kickoff §6).
 */

import { z } from "zod";

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().min(1),
    headline: z.string().min(1),
    explore: z.string().min(1),
    regionLabel: z.string().min(1),
  }),
  statBand: z.object({ eyebrow: z.string().min(1), heading: z.string().min(1) }),
  whoWeAre: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    cta: z.string().min(1),
    imageCard: z.object({ value: z.string(), label: z.string() }),
  }),
  careersTeaser: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    body: z.string().min(1),
    cta: z.string().min(1),
  }),
  contactTeaser: z.object({ heading: z.string().min(1), cta: z.string().min(1) }),
});

const imageRef = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  credit: z.string().optional(),
});

export const companySchema = z.object({
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  facts: z.array(z.object({ value: z.string(), label: z.string() })),
  image: imageRef,
  sectorsLinkHeading: z.string().min(1),
});

export const certificationsPageSchema = z.object({
  intro: z.array(z.string().min(1)),
  classificationsHeading: z.string().min(1),
  classificationsLead: z.string().min(1),
  licensesHeading: z.string().min(1),
  isoHeading: z.string().min(1),
  isoLead: z.string().min(1),
  leedLead: z.string().min(1),
  ongoingHeading: z.string().min(1),
  ongoing: z.string().min(1),
});

export const clientsPageSchema = z.object({
  title: z.string().min(1),
  subline: z.string().min(1),
  selectedHeading: z.string().min(1),
  selectedSub: z.string().min(1),
  directoryHeading: z.string().min(1),
  searchLabel: z.string().min(1),
  emptyMessage: z.string().min(1),
  disclaimer: z.string().min(1),
});

export const leadershipPageSchema = z.object({
  title: z.string().min(1),
  subline: z.string().min(1),
  pendingNote: z.string().min(1),
  placeholderCount: z.number().int().min(0),
});

export const contactPageSchema = z.object({
  title: z.string().min(1),
  subline: z.string().min(1),
  form: z.object({
    heading: z.string().min(1),
    requiredNote: z.string().min(1),
    successMessage: z.string().min(1),
    nameLabel: z.string().min(1),
    nameError: z.string().min(1),
    emailLabel: z.string().min(1),
    emailError: z.string().min(1),
    orgLabel: z.string().min(1),
    inquiryLabel: z.string().min(1),
    routePrefix: z.string().min(1),
    proposalNote: z.string().min(1),
    messageLabel: z.string().min(1),
    messageError: z.string().min(1),
    submitLabel: z.string().min(1),
  }),
  inquiryOptions: z.array(
    z.object({
      value: z.enum([
        "partnerships",
        "opportunities",
        "procurement",
        "careers",
        "general",
      ]),
      label: z.string().min(1),
      routesTo: z.string().min(1),
    }),
  ),
  details: z.object({
    heading: z.string().min(1),
    officeLabel: z.string().min(1),
    phoneLabel: z.string().min(1),
    phone: z.string(),
    emailLabel: z.string().min(1),
    hoursLabel: z.string().min(1),
    hours: z.string(),
  }),
  mapLabel: z.string().min(1),
  mapCaption: z.string().min(1),
});

export const careersPageSchema = z.object({
  title: z.string().min(1),
  intro: z.array(z.string().min(1)),
  life: z.object({
    eyebrow: z.string().min(1),
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)),
  }),
  roles: z.object({
    heading: z.string().min(1),
    note: z.string().min(1),
    emptyMessage: z.string().min(1),
    emptyLinkLabel: z.string().min(1),
  }),
  howWeHire: z.object({
    heading: z.string().min(1),
    paragraphs: z.array(z.string().min(1)),
    steps: z.array(z.object({ title: z.string().min(1), body: z.string().min(1) })),
  }),
  generalApplication: z.object({
    heading: z.string().min(1),
    body: z.string().min(1),
    cta: z.string().min(1),
  }),
  detail: z.object({
    summaryHeading: z.string().min(1),
    responsibilitiesHeading: z.string().min(1),
    requirementsHeading: z.string().min(1),
    locationHeading: z.string().min(1),
    applyLabel: z.string().min(1),
    applyNote: z.string().min(1),
    backLabel: z.string().min(1),
  }),
  filters: z.object({
    legend: z.string().min(1),
    keyword: z.string().min(1),
    keywordPlaceholder: z.string().min(1),
    location: z.string().min(1),
    sector: z.string().min(1),
    discipline: z.string().min(1),
    level: z.string().min(1),
  }),
});

export const sectorsIntroSchema = z.object({
  heading: z.string().min(1),
  subhead: z.string().min(1),
});
