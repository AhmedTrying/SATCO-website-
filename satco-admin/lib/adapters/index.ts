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

// TODO(supabase): when DATA_BACKEND === "supabase", export a supabaseAdapters
// bundle implementing the same interfaces (Auth, Postgres stores, Storage,
// deploy-hook publish). Until then only "local" is wired.
if (backend !== "local") {
  console.warn(
    `[adapters] DATA_BACKEND="${backend}" not implemented yet — using local.`,
  );
}

export const adapters: Adapters = localAdapters;

export type { Adapters } from "./types";
export type { Session } from "./types";
