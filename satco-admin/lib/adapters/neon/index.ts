/*
 * Neon adapter bundle — the Postgres implementation of every adapter interface,
 * selected by DATA_BACKEND=neon in ../index.ts. Constructing this bundle has no
 * side effects (the DB client in ../../db.ts is created lazily), so it is safe to
 * import even under DATA_BACKEND=local.
 */

import type { Adapters } from "../types";
import { neonAuditLog } from "./audit-log";
import { neonJobStore } from "./job-store";
import { neonMediaStore } from "./media-store";
import { neonSubmissionStore } from "./submission-store";
import { neonUserStore } from "./user-store";

export const neonAdapters: Adapters = {
  users: neonUserStore,
  media: neonMediaStore,
  jobs: neonJobStore,
  submissions: neonSubmissionStore,
  audit: neonAuditLog,
};
