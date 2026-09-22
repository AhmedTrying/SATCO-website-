import type { Metadata } from "next";
import { archivo, archivoExpanded, inter } from "./fonts";
import "./globals.css";
import { site } from "@/content/site";
import { SITE_URL } from "@/lib/seo";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { SiteShell } from "@/components/layout/SiteShell";

const introBootstrapScript = `
  try {
    const seen = sessionStorage.getItem("satco_intro_seen_v2") === "1";
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
