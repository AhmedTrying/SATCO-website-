"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { primaryNav } from "@/content/navigation";
import type { NavItem } from "@/lib/types";
import { isActivePath } from "@/lib/utils";
import { Emblem } from "@/components/ui/Emblem";
import { site } from "@/content/site";
import { MobileNav } from "./MobileNav";

const itemClass =
  "inline-flex rounded-md px-3 py-[9px] text-[15px] font-medium text-[var(--navfg)] no-underline transition-colors hover:text-[var(--navfg)] hover:underline hover:decoration-bronze-400 hover:decoration-2 hover:underline-offset-[7px]";

/*
 * Disclosure-nav pattern (ARIA APG): button[aria-expanded] + a plain list of
 * links in the natural tab order. Arrow keys and Escape are progressive
 * enhancements; no role=menu contract (plan §9 accessibility authority — the
 * design prototype's role=menu markup is intentionally not reproduced).
 */
function NavDropdown({
  item,
  pathname,
  open,
  onOpen,
  onClose,
}: {
  item: NavItem;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: (refocus?: boolean) => void;
}) {
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const focusFirstOnOpen = useRef(false);
  const hoverCapable = () =>
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  const focusItem = (index: number) => {
    const items = Array.from(
      panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
    );
    if (!items.length) return;
    const next = (index + items.length) % items.length;
    items[next]?.focus();
  };

  // Focus the first link after the open state has committed to the DOM
  // (keyboard open only — rAF is unreliable in backgrounded tabs).
  useEffect(() => {
    if (open && focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      focusItem(0);
    }
  }, [open]);

  return (
    <li
      className="relative"
      onMouseEnter={() => {
        if (!hoverCapable()) return;
        window.clearTimeout(closeTimer.current);
        onOpen();
      }}
      onMouseLeave={() => {
        if (!hoverCapable()) return;
        closeTimer.current = window.setTimeout(() => onClose(), 150);
      }}
      onFocus={() => window.clearTimeout(closeTimer.current)}
      onBlur={(e) => {
        // Close when focus fully leaves the trigger + panel (Tab out)
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        className="relative inline-flex cursor-pointer items-center gap-[5px] rounded-md border-none bg-transparent px-3 py-[9px] text-[15px] font-medium text-[var(--navfg)] transition-colors"
        onClick={() => (open ? onClose() : onOpen())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            if (open) {
              focusItem(0);
            } else {
              focusFirstOnOpen.current = true;
              onOpen();
            }
          } else if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        {item.label}{" "}
        <span aria-hidden="true" className="text-[11px] opacity-85">
          ▾
        </span>
        <span
          aria-hidden="true"
          className={`absolute bottom-0.5 end-3 start-3 h-0.5 origin-left bg-bronze-400 transition-transform duration-[var(--dur-base)] ease-[var(--ease-standard)] rtl:origin-right ${open ? "scale-x-100" : "scale-x-0"}`}
        />
      </button>
      <ul
        ref={panelRef}
        id={panelId}
        className={`absolute start-0 top-[calc(100%+8px)] m-0 list-none rounded-md border border-border bg-surface p-2 shadow-md transition-[opacity,transform,visibility] duration-200 ${
          item.wide ? "min-w-[340px]" : "min-w-[300px]"
        } ${
          open
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible translate-y-1.5 opacity-0"
        }`}
        onKeyDown={(e) => {
          const items = Array.from(
            panelRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          );
          const index = items.indexOf(document.activeElement as HTMLAnchorElement);
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusItem(index + 1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusItem(index - 1);
          } else if (e.key === "Escape") {
            e.preventDefault();
            onClose(true);
          }
        }}
      >
        {item.children?.map((child) => (
          <li key={child.href}>
            <Link
              href={child.href ?? "/"}
              aria-current={isActivePath(pathname, child.href) ? "page" : undefined}
              className="block rounded-md px-[13px] py-[11px] text-[14.5px] text-stone-700 no-underline transition-colors hover:bg-bronze-50 hover:text-bronze-800"
              onClick={() => onClose()}
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const isHome = pathname === "/";
  const solid = !isHome || scrolled;

  // Close menus on route change (render-time state adjustment — no effect)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpenDropdown(null);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Outside click + document-level Escape (a hover-opened panel must be
  // dismissible without keyboard focus in it — WCAG 1.4.13)
  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openDropdown]);

  const closeDropdown = useCallback((label: string, refocus?: boolean) => {
    setOpenDropdown((current) => (current === label ? null : current));
    if (refocus) {
      headerRef.current
        ?.querySelector<HTMLButtonElement>(`button[aria-expanded="true"]`)
        ?.focus();
    }
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        data-solid={solid || undefined}
        className="nav-chrome sticky top-0 z-[60]"
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-h)] max-w-[var(--container-max)] items-center justify-between gap-5 px-[var(--container-x)]"
        >
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="inline-flex flex-none items-center gap-[11px] no-underline"
          >
            <Emblem size={34} />
            <span className="font-display text-[23px] font-bold tracking-[0.16em] text-[var(--wordmark)] transition-colors">
              {site.name}
            </span>
          </Link>

          <ul className="m-0 hidden list-none items-center gap-0.5 p-0 nav:flex">
            {primaryNav.map((item) =>
              item.children ? (
                <NavDropdown
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  open={openDropdown === item.label}
                  onOpen={() => setOpenDropdown(item.label)}
                  onClose={(refocus) => closeDropdown(item.label, refocus)}
                />
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "/"}
                    aria-current={
                      isActivePath(pathname, item.href) ? "page" : undefined
                    }
                    className={itemClass}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <button
            ref={burgerRef}
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            className="inline-flex h-11 w-11 flex-none cursor-pointer items-center justify-center rounded-md border border-[rgb(180_172_157/0.5)] bg-transparent text-[var(--navfg)] nav:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>
      </header>

      <MobileNav
        open={mobileOpen}
        onClose={() => {
          setMobileOpen(false);
          burgerRef.current?.focus();
        }}
      />
    </>
  );
}
