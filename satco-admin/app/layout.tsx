import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SATCO Operations Dashboard",
  description: "Careers, website inquiries and staff access for the SATCO website.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
