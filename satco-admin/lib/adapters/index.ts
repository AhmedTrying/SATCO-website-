/*
 * Adapter selection. DATA_BACKEND picks the store implementation:
 *   local (default) — JSON files under data/ (offline dev, committed seed)
 *   neon            — Postgres via @neondatabase/serverless (needs DATABASE_URL)
 * Both satisfy the same Adapters interface, so no screen changes either way.
 */

import { localAuditLog } from "./local/audit-log";
import { localJobStore } from "./local/job-store";
import { localMediaStore } from "./local/media-store";
import { localSubmissionStore } from "./local/submission-store";
import { localUserStore } from "./local/user-store";
import { neonAdapters } from "./neon";
import type { Adapters } from "./types";

const backend = process.env.DATA_BACKEND ?? "local";

const localAdapters: Adapters = {
  users: localUserStore,
  media: localMediaStore,
  jobs: localJobStore,
  submissions: localSubmissionStore,
  audit: localAuditLog,
};

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

export type { Adapters, Session } from "./types";
