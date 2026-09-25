import type {
  DesignOption,
  DesignSectionId,
  GlobalStyleId,
} from "@satco/shared";

export interface DesignSectionDefinition {
  id: DesignSectionId;
  number: string;
  label: string;
  description: string;
  option1Label: string;
  option2Label: string;
  option2Only?: boolean;
}

export interface GlobalStyleDefinition {
  id: GlobalStyleId;
  label: string;
  description: string;
  options: Record<DesignOption, { title: string; detail: string }>;
}

export const designSelectionCopy = {
  productName: "SATCO Website Design Selection",
  eyebrow: "Management review",
  intro:
    "Review each part of the proposed website, record your preference, and see every decision combined into one continuous preview.",
  save: "Save selection",
  saved: "Selection saved",
  export: "Export decision",
  print: "Print summary",
  undo: "Undo last change",
  undoShort: "Undo",
  resetAll: "Reset all selections",
  resetSection: "Reset section",
  selected: "Selected",
  select: "Select",
  selectThisOption: "Select this option",
  pending: "Decision pending",
  progressSuffix: "sections selected",
  globalProgressSuffix: "style decisions selected",
  managementComment: "Management comment",
  commentHelp: "Saved locally with this section decision.",
  commentPlaceholder:
    "Optional \u2014 for example: Keep this layout but use the button treatment from the other option.",
  sharedHeader: "Shared navigation",
  sharedFooter: "Shared footer",
  sharedDescription:
    "The Figma concepts use the same SATCO navigation and footer, so these remain fixed while the page sections change.",
  projectsNotice:
    "Option 1 does not include a homepage projects section. Selecting Option 1 keeps Projects omitted; selecting Option 2 includes the design-review proposal only. The production /projects route remains reserved and hidden.",
  projectsOmitDetail: "Continue directly from Operating sectors to Careers.",
  projectsIncludeDetail: "Add the review-only project showcase proposed in Option 2.",
  option1Detail: "Use the first Figma direction for this section.",
  option2Detail: "Use the second Figma direction for this section.",
  fallbackNotice:
    "Unselected sections preview Option 1 until management records a decision.",
  resetTitle: "Reset every decision?",
  resetBody:
    "This clears all section choices, global styles, and management comments stored in this browser.",
  cancel: "Cancel",
  confirmReset: "Reset everything",
  resetComplete: "All selections were reset",
  finalTitle: "Final Management Selection",
  finalKicker: "SATCO website \u00b7 management design selection",
  globalTitle: "Global design",
  sectionsTitle: "Website sections",
  commentsTitle: "Management comments",
  incompleteTitle: "Selection in progress",
  incompleteBody:
    "Pending decisions are clearly marked below. Complete every section before treating this summary as final approval.",
  completeTitle: "Ready for management approval",
  completeBody:
    "All website sections have a recorded preference. Global style choices may remain shared unless management wants to override them.",
  devicePreview: "Preview device",
  websiteSection: "Website section",
  compareSideBySide: "Compare side by side",
  sampleAction: "Explore SATCO",
  sampleCard: "Operating sector",
  globalDesign: "Independent decisions",
  globalStyle: "Global style",
  globalStyleIntro:
    "Choose the shared visual treatment independently from the section layouts.",
  sharedFoundation: "One shared foundation",
  sharedFoundationBody:
    "Approved content, accessibility rules, and the SATCO brand remain fixed while every visible website section can be selected independently.",
  liveWebsite: "Combined decision",
  finalPreviewTitle: "Mixed final preview",
  finalPreviewBody:
    "This continuous page assembles the currently selected option for every website section.",
  headerLabel: "Header",
  footerLabel: "Footer",
  shared: "Shared",
  omitted: "Omitted",
  generatedInBrowser: "Decision record stored in this browser",
  notSavedYet: "Not explicitly saved yet",
  storageUnavailable: "Browser storage is unavailable; changes are temporary",
  exported: "Decision JSON exported",
  viewModes: "Design review modes",
  sectionNavigation: "Website section decisions",
  previewNavigation: "Website preview navigation",
  preview: {
    sectorCount: "Sector 01 / 04",
    previous: "Previous",
    next: "Next",
    establishedPrefix: "Est.",
    heritageLine: "Decades of infrastructure excellence",
    years: "Years",
    founded: "Founded",
    operatingSectors: "Operating sectors",
    yearsOfExperience: "Years of experience",
    oneGroup: "One group",
    connectedSectors: "Four connected operating sectors",
    viewAllSectors: "View all sectors",
    viewSector: "View sector",
    exploreSector: "Explore sector",
    projectsEyebrow: "Selected experience",
    projectsHeading: "Iconic projects across the Kingdom",
    viewAllProjects: "View all projects",
    omittedEyebrow: "Option 1 structure",
    omittedHeading: "Projects section omitted",
    professionals: "Professionals nationwide",
    contactUs: "Contact us",
    getInTouch: "Get in touch",
    rights: "All rights reserved.",
    typeSample: "Infrastructure at national scale",
    constructionAlt: "Tower cranes over a large-scale construction site",
    communityAlt: "Aerial view of a SATCO-built integrated residential community",
    teamAlt: "SATCO engineers reviewing project plans on site",
    maintenanceAlt: "SATCO professional working on site",
    riyadhAlt: "Riyadh skyline at night",
    previewNav: "Preview navigation",
    previousShort: "PREV",
    nextShort: "NEXT",
    explore: "Explore",
    joinOurTeam: "JOIN OUR TEAM",
    professionalsCount: "5,000+",
    detailsPrompt: "Connect with SATCO to discuss partnerships, opportunities, or general inquiries",
    newsletterPlaceholder: "Your email address",
    company: "Company",
    sectors: "Sectors",
    careers: "Careers",
    contact: "Contact",
  },
  optionLabels: {
    option1: "Option 1",
    option2: "Option 2",
  } satisfies Record<DesignOption, string>,
  views: {
    selection: "Selection mode",
    comparison: "Comparison mode",
    preview: "Final preview",
    approval: "Final selection",
  },
  devices: {
    desktop: "Desktop",
    tablet: "Tablet",
    mobile: "Mobile",
  },
};

export const designSections: DesignSectionDefinition[] = [
  {
    id: "header",
    number: "01",
    label: "Header and navigation",
    description: "Logo, navigation treatment, and the transition into the hero.",
    option1Label: "Dark overlay navigation",
    option2Label: "Light presentation header",
  },
  {
    id: "hero",
    number: "02",
    label: "Hero",
    description: "Opening image, headline, sector story, and primary action.",
    option1Label: "Left-aligned sector carousel",
    option2Label: "Centered airport showcase",
  },
  {
    id: "stats",
    number: "03",
    label: "Statistics",
    description: "How SATCO's scale and achievements are presented.",
    option1Label: "Flat achievement matrix",
    option2Label: "Raised statistic cards",
  },
  {
    id: "about",
    number: "04",
    label: "Company introduction",
    description: "The first corporate introduction and 1975 story.",
    option1Label: "Open split company profile",
    option2Label: "Raised company profile card",
  },
  {
    id: "sectors",
    number: "05",
    label: "Operating sectors",
    description: "How management introduces SATCO's four operating platforms.",
    option1Label: "Image-overlay carousel",
    option2Label: "Detailed capability cards",
  },
  {
    id: "careers",
    number: "06",
    label: "Careers",
    description: "The invitation to explore opportunities at SATCO.",
    option1Label: "Dark careers band",
    option2Label: "Raised careers presentation",
  },
  {
    id: "contact",
    number: "07",
    label: "Contact",
    description: "The final call to begin a conversation with SATCO.",
    option1Label: "Night-city contact panel",
    option2Label: "Clean contact presentation",
  },
  {
    id: "footer",
    number: "08",
    label: "Footer",
    description: "Closing brand, navigation, contact details, and utility links.",
    option1Label: "Structured information footer",
    option2Label: "Compact navigation footer",
  },
];

export const globalStyleDefinitions: GlobalStyleDefinition[] = [
  {
    id: "colors",
    label: "Color palette",
    description: "Both options stay within SATCO's approved bronze and stone family.",
    options: {
      option1: { title: "Heritage bronze", detail: "Warm bronze, sand, and deep stone." },
      option2: { title: "Contemporary bronze", detail: "Brighter copper accent with crisp ink neutrals." },
    },
  },
  {
    id: "typography",
    label: "Typography",
    description: "Choose the hierarchy independently from the section layouts.",
    options: {
      option1: { title: "Architectural", detail: "Archivo display headings with Inter body copy." },
      option2: { title: "Editorial", detail: "Inter-led headings with more open line spacing." },
    },
  },
  {
    id: "buttons",
    label: "Button style",
    description: "Applies to primary calls-to-action throughout the mixed preview.",
    options: {
      option1: { title: "Compact institutional", detail: "Restrained radius and concise proportions." },
      option2: { title: "Presentation-led", detail: "Larger pill-shaped actions with stronger presence." },
    },
  },
  {
    id: "cards",
    label: "Card style",
    description: "Controls shared radius, border, and shadow treatments.",
    options: {
      option1: { title: "Flat image-led", detail: "Square image overlays and restrained dividing lines." },
      option2: { title: "Raised presentation", detail: "Rounded surfaces, fine bronze borders, and soft shadows." },
    },
  },
  {
    id: "background",
    label: "Background style",
    description: "Sets the page rhythm behind whichever layouts are selected.",
    options: {
      option1: { title: "Warm sectional", detail: "Sand, white, and charcoal bands." },
      option2: { title: "Crisp continuous", detail: "White-led canvas with deliberate bronze interruptions." },
    },
  },
];
