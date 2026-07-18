/*
 * Contact inquiry → department routing (docx comment #22, Sultan → Bandar).
 * Matches the site's contactPage.inquiryOptions[].routesTo labels exactly so the
 * dashboard inbox and the public form agree. Still a PROPOSAL pending sign-off —
 * surfaced as such in the UI, editable later without code changes.
 */

import type { InquiryType } from "@satco/shared";

export const DEPARTMENT_ROUTING: Record<InquiryType, string> = {
  partnerships: "Business Development & Info",
  opportunities: "Business Development & Info",
  procurement: "Procurement & Info",
  careers: "Human Resources",
  general: "Info (general)",
};

export function routeFor(inquiry: InquiryType): string {
  return DEPARTMENT_ROUTING[inquiry];
}

export const INQUIRY_LABELS: Record<InquiryType, string> = {
  partnerships: "Discuss partnerships",
  opportunities: "Opportunities",
  procurement: "Procurement",
  careers: "Careers",
  general: "General inquiries",
};
