"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { MaintenanceBanner } from "@/components/layout/MaintenanceBanner";
import { Nav } from "@/components/layout/Nav";
import { RouteFocus } from "@/components/layout/RouteFocus";
import { SkipLink } from "@/components/layout/SkipLink";

/**
 * Keeps the temporary management selector out of the public-site chrome while
 * preserving the existing root layout and every production route unchanged.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDesignSelection = pathname.startsWith("/design-selection");

  if (isDesignSelection) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      <LoadingScreen />
      <MaintenanceBanner />
      <SkipLink />
      <Nav />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <RouteFocus />
    </>
  );
}
