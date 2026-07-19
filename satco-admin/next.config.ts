import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dashboard is a normal server app (server actions + local file I/O now,
  // Neon Postgres via the adapter seam) — NOT a static export like satco-web.
  transpilePackages: ["@satco/shared"],
  // Keep the Neon driver out of the server bundle — it's a Node package that uses
  // global fetch/WebSocket; bundling it can break resolution. Server code imports it
  // at runtime instead (DATA_BACKEND=neon).
  serverExternalPackages: ["@neondatabase/serverless"],
  // Local Windows dev ONLY (see satco-web/next.config.ts): the .next/node_modules
  // junctions need Turbopack's root at the project's drive root (D:) — an ancestor
  // of both the project and the D:\satco-dev junction targets. Omitted on Linux CI
  // so the Vercel build works.
  ...(process.platform === "win32" ? { turbopack: { root: "D:\\" } } : {}),
};

export default nextConfig;
