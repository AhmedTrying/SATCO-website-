import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dashboard is a normal server app (server actions + local file I/O now,
  // Supabase later) — NOT a static export like satco-web.
  transpilePackages: ["@satco/shared"],
  // node_modules/.next are NTFS junctions into C:\satco-dev — outside OneDrive
  // (sync storms) and outside the MSIX-virtualized profile. Turbopack's root
  // must contain both the project and the junction targets (same reason as
  // satco-web/next.config.ts).
  turbopack: {
    root: "C:\\",
  },
};

export default nextConfig;
