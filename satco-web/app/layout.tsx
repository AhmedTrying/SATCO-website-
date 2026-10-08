import type { Metadata } from "next";
import { archivo, archivoExpanded, inter } from "./fonts";
import "./globals.css";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/seo";
import { sectors } from "@/content/sectors";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteShell } from "@/components/layout/SiteShell";

const introBootstrapScript = `
  try {
    /* "?intro=1" replays the intro (A/B/C review board, satco-review/); see LoadingScreen. */
    const replay = new URLSearchParams(location.search).get("intro") === "1";
    const seen = !replay && sessionStorage.getItem("satco_intro_seen_v2") === "1";
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) document.documentElement.dataset.satcoIntro = "skip";
  } catch {}
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — ${site.legalName}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  // FIX-35: a canonical link on every page. "./" resolves against each route's
  // own pathname (trailing slash kept), with metadataBase supplying the origin.
  alternates: { canonical: "./" },
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en",
    // Share image = the Airports hero, described by its own alt text (FIX-35).
    images: [{ url: "/images/airport-1-1600.jpg", alt: sectors[0].hero.alt }],
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
      suppressHydrationWarning
      className={`${inter.variable} ${archivo.variable} ${archivoExpanded.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootstrapScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        {/* Without JS, framer-managed reveals must not hide content */}
        <noscript>
          <style>{`.reveal-init{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <SiteShell>{children}</SiteShell>
        </MotionProvider>
      </body>
    </html>
  );
}
