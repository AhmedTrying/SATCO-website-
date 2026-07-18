/*
 * Sidebar navigation model. `cap` gates VISIBILITY (least privilege to see the
 * screen); in-page write actions re-check capabilities server-side.
 */

import type { RoleCapability } from "@satco/shared";

export interface NavLink {
  label: string;
  href: string;
  /** Minimum capability to see this link. Omitted = visible to any signed-in user. */
  cap?: RoleCapability;
  /** Short glyph (emoji) used as a lightweight icon in the rail. */
  icon: string;
}

export interface NavSection {
  title?: string;
  links: NavLink[];
}

export const NAV: NavSection[] = [
  {
    links: [{ label: "Overview", href: "/overview", icon: "◵" }],
  },
  {
    title: "Content",
    links: [
      { label: "Homepage", href: "/content/homepage", icon: "⌂" },
      { label: "Sectors", href: "/content/sectors", icon: "◧" },
      { label: "About", href: "/content/about", icon: "❯" },
      { label: "Site settings", href: "/content/settings", icon: "⚙", cap: "admin" },
    ],
  },
  {
    title: "Operations",
    links: [
      { label: "Media library", href: "/media", icon: "▦" },
      { label: "Careers", href: "/careers", icon: "☰" },
      { label: "Contact", href: "/contact", icon: "✉", cap: "manageJobs" },
    ],
  },
  {
    title: "Administration",
    links: [
      { label: "Features & settings", href: "/features", icon: "⚑", cap: "admin" },
      { label: "Users & roles", href: "/users", icon: "◍", cap: "admin" },
      { label: "Publish center", href: "/publish", icon: "▲", cap: "publish" },
    ],
  },
];
