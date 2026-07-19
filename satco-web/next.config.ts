import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Compile the shared types package from source (it ships .ts, no build step).
  transpilePackages: ["@satco/shared"],
  // Local Windows dev ONLY: node_modules/.next are NTFS junctions into
  // D:\satco-dev (out of OneDrive + the MSIX-virtualized profile), so Turbopack's
  // root must be the drive root — and it MUST be the project's own drive (D:) so it
  // is an ancestor of both the project and the junction targets; a different drive
  // (e.g. "C:\\") is not an ancestor, gets ignored, and the CSS/Tailwind resolve
  // fails with "outside of root directory". On Linux CI (Vercel) there are no
  // junctions — omit it so Turbopack infers the workspace root ("D:\\" breaks it).
  ...(process.platform === "win32" ? { turbopack: { root: "D:\\" } } : {}),
};

export default nextConfig;
