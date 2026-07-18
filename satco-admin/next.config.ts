import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dashboard is a normal server app (server actions + local file I/O now,
  // Supabase later) — NOT a static export like satco-web.
  transpilePackages: ["@satco/shared"],
  // Local Windows dev ONLY (see satco-web/next.config.ts): the .next/node_modules
  // junctions need Turbopack's root at the drive root. Omitted on Linux CI so the
  // Vercel build works.
  ...(process.platform === "win32" ? { turbopack: { root: "C:\\" } } : {}),
};

export default nextConfig;
