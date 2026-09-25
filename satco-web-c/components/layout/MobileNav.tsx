"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { primaryNav } from "@/content/navigation";
import { site } from "@/content/site";
import { isActivePath } from "@/lib/utils";

const topLevelLink =
  "block border-b border-stone-100 px-3 py-[15px] text-[17px] font-semibold text-ink no-underline";
const subLink =
  "block py-3 pe-3 ps-5 text-[15px] text-stone-600 no-underline transition-colors hover:text-bronze-800";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      className={`transition-transform duration-[var(--dur-base)] ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Slide-in drawer with focus trap, scroll lock, and accordion sub-menus (plan §6/§9). */
export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // Scroll lock + initial focus. Focus moves synchronously after commit —
  // the drawer's visibility flips instantly on open (only transform animates),
  // and any delay leaves a window where Tab escapes behind the modal.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = Array.from(
      drawerRef.current?.querySelectorAll<HTMLElement>("a, button") ?? [],
    ).filter((el) => el.offsetParent !== null);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div aria-hidden={!open}>
      <div
        className={`fixed inset-0 z-[110] bg-[rgb(29_26_22/0.5)] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open || undefined}
        className="drawer fixed bottom-0 end-0 top-0 z-[120] flex w-[min(86vw,380px)] flex-col bg-surface shadow-lg"
        onKeyDown={trapFocus}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-[18px]">
          <span className="font-display text-xl font-bold tracking-[0.16em] text-bronze-800">
            {site.name}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close menu"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border bg-transparent text-stone-700"
            onClick={onClose}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 pb-7 pt-2">
          {primaryNav.map((item) => {
            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href ?? "/"}
                  aria-current={
                    isActivePath(pathname, item.href) ? "page" : undefined
                  }
                  className={topLevelLink}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              );
            }
            const groupOpen = openGroup === item.label;
            const panelId = `mobile-group-${item.label.replace(/\W+/g, "-").toLowerCase()}`;
            return (
              <div key={item.label} className="border-b border-stone-100">
                <button
                  type="button"
                  aria-expanded={groupOpen}
                  aria-controls={panelId}
                  className="flex w-full cursor-pointer items-center justify-between border-none bg-transparent px-3 py-[15px] text-start text-[17px] font-semibold text-ink"
                  onClick={() =>
                    setOpenGroup(groupOpen ? null : item.label)
                  }
                >
                  {item.label} <Chevron open={groupOpen} />
                </button>
                <div
                  id={panelId}
                  className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-standard)]"
                  style={{ gridTemplateRows: groupOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href ?? "/"}
                        aria-current={
                          isActivePath(pathname, child.href) ? "page" : undefined
                        }
                        className={subLink}
                        onClick={onClose}
                        tabIndex={groupOpen ? undefined : -1}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
