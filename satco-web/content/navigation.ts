import type { FooterColumn, NavItem } from "@/lib/types";

import data from "./generated/navigation.json";

/*
 * Navigation tree — sourced from the generated JSON.
 * Locked: no "My SATCO"/employee/login tab (docx comment #4).
 */
export const primaryNav = data.primaryNav as unknown as NavItem[];

/** Footer sitemap columns. */
export const footerColumns = data.footerColumns as unknown as FooterColumn[];

/** Contact column — Footer merges site.contact address/email after the link. */
export const footerContactColumn =
  data.footerContactColumn as unknown as FooterColumn;
