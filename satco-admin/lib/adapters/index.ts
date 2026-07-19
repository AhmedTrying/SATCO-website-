/*
 * Adapter selection (dashboard kickoff §3).
 * DATA_BACKEND=local now → supabase later. Everything server-side imports the
 * `adapters` bundle from here; no screen touches a concrete store.
 */

import { mockAuth } from "./local/auth";
import { localAuditLog } from "./local/audit-log";
import { localContentStore } from "./local/content-store";
import { localJobStore } from "./local/job-store";
import { localMediaStore } from "./local/media-store";
import { localPublishService } from "./local/publish-service";
import { localSubmissionStore } from "./local/submission-store";
import { neonAdapters } from "./neon";
import type { Adapters } from "./types";

const backend = process.env.DATA_BACKEND ?? "local";

const localAdapters: Adapters = {
  auth: mockAuth,
  content: localContentStore,
  media: localMediaStore,
  jobs: localJobStore,
  submissions: localSubmissionStore,
  audit: localAuditLog,
  publish: localPublishService,
};

// DATA_BACKEND selects the store implementation:
//   local (default) — JSON files under data/ (offline dev, committed seed)
//   neon            — Postgres via @neondatabase/serverless (needs DATABASE_URL)
// Both satisfy the same Adapters interface, so no screen changes either way.
// (A future Supabase bundle would slot in here identically.)
function selectAdapters(): Adapters {
  switch (backend) {
    case "neon":
      return neonAdapters;
    case "local":
      return localAdapters;
    default:
      console.warn(`[adapters] DATA_BACKEND="${backend}" is unknown — using local.`);
      return localAdapters;
  }
}

export const adapters: Adapters = selectAdapters();

export type { Adapters } from "./types";
export type { Session } from "./types";
