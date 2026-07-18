/*
 * Local AuditLog — append-only JSON. TODO(supabase): an `audit_log` table.
 */

import type { AuditEntry } from "@satco/shared";

import type { AuditLog } from "../types";
import { makeId, readStore, writeStore } from "./store";

const FILE = "audit.json";

export const localAuditLog: AuditLog = {
  async append(entry: Omit<AuditEntry, "id" | "ts">): Promise<AuditEntry> {
    const items = await readStore<AuditEntry[]>(FILE);
    const record: AuditEntry = {
      ...entry,
      id: makeId("audit"),
      ts: new Date().toISOString(),
    };
    items.unshift(record);
    await writeStore(FILE, items);
    return record;
  },

  async list(limit = 200): Promise<AuditEntry[]> {
    const items = await readStore<AuditEntry[]>(FILE);
    return items.slice(0, limit);
  },
};
