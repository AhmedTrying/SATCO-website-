import type { Metadata } from "next";
import { archivo, inter } from "./fonts";
import "./globals.css";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/seo";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/loading/LoadingScreen";
import { MaintenanceBanner } from "@/components/layout/MaintenanceBanner";
import { Nav } from "@/components/layout/Nav";
import { RouteFocus } from "@/components/layout/RouteFocus";
import { SkipLink } from "@/components/layout/SkipLink";
import { MotionProvider } from "@/components/motion/MotionProvider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.legalName}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en",
    images: [{ url: "/images/airport-1-1600.jpg", alt: "" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // dir is the RTL seam (plan §8) — flipping to "rtl" later re-lays the system.
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Without JS, framer-managed reveals must not hide content */}
        <noscript>
          <style>{`.reveal-init{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <LoadingScreen />
          <MaintenanceBanner />
          <SkipLink />
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <RouteFocus />
        </MotionProvider>
      </body>
    </html>
  );
}
