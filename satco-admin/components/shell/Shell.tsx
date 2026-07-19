"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { roleCan } from "@satco/shared";

import { signOutAction } from "@/app/actions/auth";
import { Emblem } from "@/components/ui/Emblem";
import { NAV } from "@/lib/nav";
import type { Session } from "@/lib/adapters";

import { RoleSwitcher } from "./RoleSwitcher";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function Shell({
  session,
  backend,
  children,
}: {
  session: Session;
  backend: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sections = NAV.map((s) => ({
    ...s,
    links: s.links.filter((l) => !l.cap || roleCan(session.role, l.cap)),
  })).filter((s) => s.links.length > 0);

  return (
    <div className="min-h-screen">
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-open={open ? "" : undefined}
        className="admin-drawer on-dark fixed inset-y-0 start-0 z-40 flex w-[var(--nav-w)] flex-col bg-stone-900 text-stone-300"
      >
        <div className="flex items-center gap-2 border-b border-stone-800 px-4 h-[var(--topbar-h)]">
          <Emblem />
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">SATCO</div>
            <div className="text-[0.65rem] uppercase tracking-wide text-stone-500">
              Control dashboard
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className="mb-4">
              {section.title && (
                <div className="px-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500">
                  {section.title}
                </div>
              )}
              <ul className="space-y-0.5">
                {section.links.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={[
                          "flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-bronze-800 text-white"
                            : "text-stone-300 hover:bg-stone-800 hover:text-white",
                        ].join(" ")}
                      >
                        <span
                          aria-hidden="true"
                          className="w-4 text-center text-bronze-300"
                        >
                          {link.icon}
                        </span>
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-stone-800 px-4 py-3 text-[0.7rem] text-stone-500">
          {backend === "neon" ? "Neon Postgres backend" : "Local JSON backend"}
        </div>
      </aside>

      {/* Main column */}
      <div className="lg:ps-[var(--nav-w)]">
        <header className="sticky top-0 z-20 flex h-[var(--topbar-h)] items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur">
          <button
            type="button"
            className="btn btn-ghost -ms-2 px-2 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true" className="text-lg">
              ☰
            </span>
          </button>

          <div className="ms-auto flex items-center gap-3">
            <RoleSwitcher role={session.role} />
            <div className="hidden text-end leading-tight sm:block">
              <div className="text-xs font-medium text-strong">{session.name}</div>
              <div className="text-[0.65rem] text-muted">{session.email}</div>
            </div>
            <form action={signOutAction}>
              <button type="submit" className="btn btn-secondary h-8 py-1 text-xs">
                Sign out
              </button>
            </form>
          </div>
        </header>

        <main className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
