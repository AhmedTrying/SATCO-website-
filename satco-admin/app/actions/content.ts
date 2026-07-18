"use server";

import { revalidatePath } from "next/cache";

import type {
  Certification,
  Classification,
  Client,
  ContentBundle,
  LeadershipMember,
  License,
  NavigationContent,
  Sector,
  SiteContent,
  Stat,
} from "@satco/shared";
import {
  certificationSchema,
  classificationSchema,
  clientSchema,
  leadershipMemberSchema,
  licenseSchema,
  sectorSchema,
  siteContentSchema,
  statSchema,
} from "@satco/shared/schemas";
import { z } from "zod";

import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";
import {
  careersPageSchema,
  certificationsPageSchema,
  clientsPageSchema,
  companySchema,
  contactPageSchema,
  homeSchema,
  leadershipPageSchema,
  sectorsIntroSchema,
} from "@/lib/content-schemas";

export interface SaveResult {
  ok: boolean;
  error?: string;
}

/** Validate → patch draft → audit → revalidate. Shared by every content action. */
async function patchDraft(
  patch: Partial<ContentBundle>,
  entity: string,
  summary: string,
): Promise<SaveResult> {
  const session = await requireCapability("edit");
  const draft = await adapters.content.getDraft();
  await adapters.content.saveDraft({ ...draft, ...patch });
  await adapters.audit.append({
    actor: session.email,
    action: "content.update",
    entity,
    summary,
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

function fail(e: unknown): SaveResult {
  if (e instanceof z.ZodError) {
    const first = e.issues[0];
    return {
      ok: false,
      error: `${first.path.join(".") || "value"}: ${first.message}`,
    };
  }
  return { ok: false, error: e instanceof Error ? e.message : "Save failed" };
}

/* ------------------------------- Homepage -------------------------------- */

export async function saveHome(data: unknown): Promise<SaveResult> {
  try {
    const home = homeSchema.parse(data);
    return await patchDraft({ home }, "home", "Updated homepage copy.");
  } catch (e) {
    return fail(e);
  }
}

export async function saveStats(data: unknown): Promise<SaveResult> {
  try {
    const stats = z.array(statSchema).parse(data) as Stat[];
    return await patchDraft({ stats }, "stats", "Updated homepage stats.");
  } catch (e) {
    return fail(e);
  }
}

/* -------------------------------- Sectors -------------------------------- */

export async function saveSectorsIntro(data: unknown): Promise<SaveResult> {
  try {
    const sectorsIntro = sectorsIntroSchema.parse(data);
    return await patchDraft(
      { sectorsIntro },
      "sectorsIntro",
      "Updated sectors intro.",
    );
  } catch (e) {
    return fail(e);
  }
}

export async function saveSectorsGlobal(data: unknown): Promise<SaveResult> {
  try {
    const parsed = z
      .object({
        showPendingExperience: z.boolean(),
        pendingExperienceCard: z.object({
          heading: z.string().min(1),
          body: z.string().min(1),
          linkLabel: z.string().min(1),
        }),
      })
      .parse(data);
    return await patchDraft(
      parsed,
      "sectors",
      `Selected Experience publishing ${parsed.showPendingExperience ? "ON" : "OFF"}.`,
    );
  } catch (e) {
    return fail(e);
  }
}

export async function saveSector(slug: string, data: unknown): Promise<SaveResult> {
  try {
    const sector = sectorSchema.parse(data) as Sector;
    const draft = await adapters.content.getDraft();
    const sectors = draft.sectors.map((s) => (s.slug === slug ? sector : s));
    if (!sectors.some((s) => s.slug === sector.slug)) {
      return { ok: false, error: `Sector ${slug} not found` };
    }
    return await patchDraft({ sectors }, "sector", `Updated sector: ${sector.name}.`);
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------------- About --------------------------------- */

export async function saveCompany(data: unknown): Promise<SaveResult> {
  try {
    const company = companySchema.parse(data);
    return await patchDraft({ company }, "company", "Updated company information.");
  } catch (e) {
    return fail(e);
  }
}

export async function saveLeadership(data: unknown): Promise<SaveResult> {
  try {
    const parsed = z
      .object({
        leadershipPage: leadershipPageSchema,
        leadership: z.array(leadershipMemberSchema),
      })
      .parse(data);
    return await patchDraft(
      {
        leadershipPage: parsed.leadershipPage,
        leadership: parsed.leadership as LeadershipMember[],
      },
      "leadership",
      `Updated leadership (${parsed.leadership.length} people).`,
    );
  } catch (e) {
    return fail(e);
  }
}

export async function saveCertifications(data: unknown): Promise<SaveResult> {
  try {
    const parsed = z
      .object({
        certificationsPage: certificationsPageSchema,
        classifications: z.array(classificationSchema),
        licenses: z.array(licenseSchema),
        certifications: z.array(certificationSchema),
      })
      .parse(data);
    return await patchDraft(
      {
        certificationsPage: parsed.certificationsPage,
        classifications: parsed.classifications as Classification[],
        licenses: parsed.licenses as License[],
        certifications: parsed.certifications as Certification[],
      },
      "certifications",
      "Updated classifications, licenses & certifications.",
    );
  } catch (e) {
    return fail(e);
  }
}

export async function saveClients(data: unknown): Promise<SaveResult> {
  try {
    const parsed = z
      .object({
        clientsPage: clientsPageSchema,
        clients: z.array(clientSchema),
      })
      .parse(data);
    // Locked rule (docx comment #31): Selected Clients hard max 30.
    const selectedCount = parsed.clients.filter((c) => c.tier === "selected").length;
    if (selectedCount > 30) {
      return {
        ok: false,
        error: `Selected Clients is capped at 30 (you have ${selectedCount}).`,
      };
    }
    return await patchDraft(
      { clientsPage: parsed.clientsPage, clients: parsed.clients as Client[] },
      "clients",
      `Updated clients (${selectedCount} selected).`,
    );
  } catch (e) {
    return fail(e);
  }
}

/* ----------------------------- Site settings ----------------------------- */

export async function saveSite(data: unknown): Promise<SaveResult> {
  try {
    const site = siteContentSchema.parse(data) as SiteContent;
    return await patchDraft({ site }, "site", "Updated site settings.");
  } catch (e) {
    return fail(e);
  }
}

const navItemSchema: z.ZodType<NavigationContent["primaryNav"][number]> = z.lazy(
  () =>
    z.object({
      label: z.string().min(1),
      href: z.string().optional(),
      wide: z.boolean().optional(),
      children: z.array(navItemSchema).optional(),
    }),
);

const footerColumnSchema = z.object({
  title: z.string().min(1),
  links: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string(),
      external: z.boolean().optional(),
      disabled: z.boolean().optional(),
    }),
  ),
});

export async function saveNavigation(data: unknown): Promise<SaveResult> {
  try {
    const navigation = z
      .object({
        primaryNav: z.array(navItemSchema),
        footerColumns: z.array(footerColumnSchema),
        footerContactColumn: footerColumnSchema,
      })
      .parse(data) as NavigationContent;
    return await patchDraft({ navigation }, "navigation", "Updated navigation.");
  } catch (e) {
    return fail(e);
  }
}

/* ----------------------- Careers & Contact page copy --------------------- */

export async function saveCareersPage(data: unknown): Promise<SaveResult> {
  try {
    const careersPage = careersPageSchema.parse(data);
    return await patchDraft(
      { careersPage },
      "careersPage",
      "Updated careers page copy.",
    );
  } catch (e) {
    return fail(e);
  }
}

export async function saveContactPage(data: unknown): Promise<SaveResult> {
  try {
    const contactPage = contactPageSchema.parse(data);
    return await patchDraft(
      { contactPage },
      "contactPage",
      "Updated contact page copy.",
    );
  } catch (e) {
    return fail(e);
  }
}
