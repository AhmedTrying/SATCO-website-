/**
 * Versioned, portable decision model for the temporary management design
 * selector. It deliberately contains no rendering concerns so the same JSON can
 * later be consumed by the site, dashboard, or a backend approval workflow.
 */

export const DESIGN_OPTIONS = ["option1", "option2"] as const;
export type DesignOption = (typeof DESIGN_OPTIONS)[number];
export type DesignChoice = DesignOption | null;

export const DESIGN_SECTION_IDS = [
  "header",
  "hero",
  "stats",
  "about",
  "sectors",
  "careers",
  "contact",
  "footer",
] as const;
export type DesignSectionId = (typeof DESIGN_SECTION_IDS)[number];

export const GLOBAL_STYLE_IDS = [
  "colors",
  "typography",
  "buttons",
  "cards",
  "background",
] as const;
export type GlobalStyleId = (typeof GLOBAL_STYLE_IDS)[number];

export interface SectionDecision {
  choice: DesignChoice;
  comment: string;
}

export interface DesignSelectionConfig {
  version: 2;
  global: Record<GlobalStyleId, DesignChoice>;
  sections: Record<DesignSectionId, SectionDecision>;
  updatedAt: string | null;
}

export function createEmptyDesignSelection(): DesignSelectionConfig {
  return {
    version: 2,
    global: {
      colors: null,
      typography: null,
      buttons: null,
      cards: null,
      background: null,
    },
    sections: {
      header: { choice: null, comment: "" },
      hero: { choice: null, comment: "" },
      stats: { choice: null, comment: "" },
      about: { choice: null, comment: "" },
      sectors: { choice: null, comment: "" },
      careers: { choice: null, comment: "" },
      contact: { choice: null, comment: "" },
      footer: { choice: null, comment: "" },
    },
    updatedAt: null,
  };
}

function choice(value: unknown): DesignChoice {
  return value === "option1" || value === "option2" ? value : null;
}

/** Safely normalizes unknown LocalStorage/imported data to the current schema. */
export function normalizeDesignSelection(value: unknown): DesignSelectionConfig {
  const empty = createEmptyDesignSelection();
  if (!value || typeof value !== "object") return empty;

  const input = value as {
    global?: Record<string, unknown>;
    sections?: Record<string, { choice?: unknown; comment?: unknown }>;
    updatedAt?: unknown;
  };

  for (const id of GLOBAL_STYLE_IDS) {
    empty.global[id] = choice(input.global?.[id]);
  }
  for (const id of DESIGN_SECTION_IDS) {
    const section = input.sections?.[id];
    empty.sections[id] = {
      choice: choice(section?.choice),
      comment: typeof section?.comment === "string" ? section.comment : "",
    };
  }
  empty.updatedAt = typeof input.updatedAt === "string" ? input.updatedAt : null;
  return empty;
}
