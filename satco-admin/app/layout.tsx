import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SATCO Control Dashboard",
  description: "Content, media, careers, contact and feature control for satco-web.",
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
