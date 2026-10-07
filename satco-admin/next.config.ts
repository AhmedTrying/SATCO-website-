import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dashboard is a normal server app (server actions + local file I/O now,
  // Neon Postgres via the adapter seam) — NOT a static export like satco-web.
  transpilePackages: ["@satco/shared"],
  // Security headers on every response (the static sites set the same ones in
  // their vercel.json, since `headers()` does not apply to `output: "export"`).
  // The dashboard is never meant to be indexed, so X-Robots-Tag is unconditional.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
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
