import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Compile the shared types package from source (it ships .ts, no build step).
  transpilePackages: ["@satco/shared"],
  // node_modules/.next are NTFS junctions into C:\satco-dev\satco-web-store —
  // outside OneDrive (sync storms) AND outside the user profile (the Claude
  // MSIX container virtualizes AppData/profile writes per-process, which split
  // the store into divergent copies). Turbopack's root must contain both the
  // project and the junction target, hence the drive root.
  turbopack: {
    root: "C:\\",
  },
};

export default nextConfig;
