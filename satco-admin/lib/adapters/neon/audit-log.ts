/*
 * Neon AuditLog — append-only `audit_log` table. Interface unchanged.
 */

import type { AuditEntry } from "@satco/shared";

import type { AuditLog } from "../types";
import { makeId } from "../local/store";
import { query, jsonbParam } from "../../db";
import { toAudit, type AuditRow } from "./mappers";

export const neonAuditLog: AuditLog = {
  async append(entry: Omit<AuditEntry, "id" | "ts">): Promise<AuditEntry> {
    const record: AuditEntry = {
      ...entry,
      id: makeId("audit"),
      ts: new Date().toISOString(),
    };
    await query(
      `insert into audit_log (id, ts, actor, action, entity, entity_id, summary, diff)
       values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [
        record.id,
        record.ts,
        record.actor,
        record.action,
        record.entity,
        record.entityId ?? null,
        record.summary,
        // Absent diff → SQL NULL; present diff → jsonb payload.
        record.diff === undefined ? null : jsonbParam(record.diff),
      ],
    );
    return record;
  },

  async list(limit = 200): Promise<AuditEntry[]> {
    const rows = await query<AuditRow>(
      "select * from audit_log order by ts desc, seq asc limit $1",
      [limit],
    );
    return rows.map(toAudit);
  },
};
