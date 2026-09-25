"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * On client-side navigation, move focus to the new page's h1 so keyboard and
 * screen-reader users are never lost (plan §9). Skips the initial page load.
 */
export function RouteFocus() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    if (previous.current !== null && previous.current !== pathname) {
      const h1 = document.querySelector<HTMLElement>("main h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }
    previous.current = pathname;
  }, [pathname]);

  return null;
}
