import type { SiteContent } from "@/lib/types";

import data from "./generated/site.json";

/*
 * Site identity, contact and flags — sourced from the generated JSON the
 * dashboard publishes (kickoff §2.2). A committed snapshot ships in the repo, so
 * the site still builds if it is never republished. The cast is the trust point:
 * the JSON is validated on write by the dashboard against @satco/shared.
 */
export const site = data as unknown as SiteContent;

/** Footer-specific presentation copy and external destinations. */
export const footerContent = {
  tagline: "Delivering infrastructure and services at national scale since 1975.",
  officeLabel: "Riyadh office",
  directionsLabel: "Get directions",
  linkedinLabel: "LinkedIn",
  linkedinAriaLabel: "SATCO on LinkedIn",
  linkedinHref:
    "https://www.linkedin.com/company/saudi-arabian-trading-&-construction-co---satco/home/",
} as const;
