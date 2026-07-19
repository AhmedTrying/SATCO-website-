/*
 * Neon adapter bundle — the Postgres implementation of every adapter interface,
 * wired together and selected by DATA_BACKEND=neon in ../index.ts. Constructing this
 * bundle has no side effects (the DB client in ../../db.ts is created lazily), so it
 * is safe to import even under DATA_BACKEND=local.
 */

import type { Adapters } from "../types";
import { neonAuditLog } from "./audit-log";
import { neonAuth } from "./auth";
import { neonContentStore } from "./content-store";
import { neonJobStore } from "./job-store";
import { neonMediaStore } from "./media-store";
import { neonPublishService } from "./publish-service";
import { neonSubmissionStore } from "./submission-store";

export const neonAdapters: Adapters = {
  auth: neonAuth,
  content: neonContentStore,
  media: neonMediaStore,
  jobs: neonJobStore,
  submissions: neonSubmissionStore,
  audit: neonAuditLog,
  publish: neonPublishService,
};
