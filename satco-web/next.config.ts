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
  // C:\satco-dev (out of OneDrive + the MSIX-virtualized profile), so Turbopack's
  // root must be the drive root to contain both the project and the junction
  // targets. On Linux CI (Vercel) there are no junctions — omit it so Turbopack
  // infers the workspace root correctly (otherwise "C:\\" breaks the build).
  ...(process.platform === "win32" ? { turbopack: { root: "C:\\" } } : {}),
};

export default nextConfig;
