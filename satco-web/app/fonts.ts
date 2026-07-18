import localFont from "next/font/local";

/*
 * Self-hosted fonts (plan §3.4, Pairing A) — woff2 committed to the repo,
 * no runtime Google Fonts request. Latin subsets; weights per the approved design.
 */

export const inter = localFont({
  src: [
    { path: "../public/fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const archivo = localFont({
  src: [
    { path: "../public/fonts/archivo-600.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/archivo-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-archivo",
  display: "swap",
});
