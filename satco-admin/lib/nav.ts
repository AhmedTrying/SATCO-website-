/*
 * Sidebar navigation model, built per session: a Careers link when the user has
 * the Jobs page, one link per inquiry inbox they may open, and the admin section. Visibility here mirrors the server-side gating in lib/auth.ts
 * (requireCapability / requireInbox); in-page write actions re-check too.
 */

import { accessibleInboxes, userCan } from "@satco/shared";

import type { Session } from "./adapters/types";
import { INQUIRY_LABELS } from "./routing";

export interface NavLink {
  label: string;
  href: string;
  /** Short glyph used as a lightweight icon in the rail. */
  icon: string;
}

export interface NavSection {
  title?: string;
  links: NavLink[];
}

export function inboxHref(inbox: string): string {
  return `/inquiries/${inbox}`;
}

export function navFor(session: Session): NavSection[] {
  const sections: NavSection[] = [
    { links: [{ label: "Overview", href: "/overview", icon: "◵" }] },
  ];

  if (userCan(session, "manageJobs")) {
    sections.push({
      title: "Careers",
      links: [{ label: "Jobs & applications", href: "/careers", icon: "☰" }],
    });
  }

  const inboxes = accessibleInboxes(session);
  if (inboxes.length > 0) {
    sections.push({
      title: "Inquiries",
      links: [
        ...(inboxes.length > 1
          ? [{ label: "All my inboxes", href: "/inquiries", icon: "✉" }]
          : []),
        ...inboxes.map((inbox) => ({
          label: INQUIRY_LABELS[inbox],
          href: inboxHref(inbox),
          icon: "›",
        })),
      ],
    });
  }

  if (userCan(session, "admin")) {
    sections.push({
      title: "Administration",
      links: [{ label: "Users & access", href: "/users", icon: "◍" }],
    });
  }

  return sections;
}
