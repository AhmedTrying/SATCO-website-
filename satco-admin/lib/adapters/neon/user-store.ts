/*
 * Neon UserStore — the staff directory in the Postgres `users` table.
 * Sign-in itself is Google OAuth (lib/auth/google.ts); this table decides who may
 * enter, with which role and which pages.
 */

import type { UserAccount } from "@satco/shared";

import type { UserStore } from "../types";
import { makeId } from "../local/store";
import { jsonbParam, query, queryOne } from "../../db";
import { toUser, type UserRow } from "./mappers";

export const neonUserStore: UserStore = {
  async list() {
    const rows = await query<UserRow>("select * from users order by seq asc");
    return rows.map(toUser);
  },

  async getByEmail(email) {
    const row = await queryOne<UserRow>(
      "select * from users where lower(email) = lower($1)",
      [email.trim()],
    );
    return row ? toUser(row) : undefined;
  },

  async getById(id) {
    const row = await queryOne<UserRow>("select * from users where id = $1", [id]);
    return row ? toUser(row) : undefined;
  },

  async create(input) {
    const existing = await queryOne<{ id: string }>(
      "select id from users where lower(email) = lower($1)",
      [input.email],
    );
    if (existing) throw new Error(`An account already exists for ${input.email}`);
    const user: UserAccount = {
      id: makeId("u"),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      access: input.access,
      active: true,
      createdAt: new Date().toISOString(),
    };
    await query(
      `insert into users (id, name, email, role, access, active, created_at)
       values ($1, $2, $3, $4, $5::jsonb, $6, $7)`,
      [
        user.id,
        user.name,
        user.email,
        user.role,
        jsonbParam(user.access),
        user.active,
        user.createdAt,
      ],
    );
    return user;
  },

  async update(id, patch) {
    const sets: string[] = [];
    const values: unknown[] = [];
    if (patch.name !== undefined) {
      values.push(patch.name);
      sets.push(`name = $${values.length}`);
    }
    if (patch.role !== undefined) {
      values.push(patch.role);
      sets.push(`role = $${values.length}`);
    }
    if (patch.access !== undefined) {
      values.push(jsonbParam(patch.access));
      sets.push(`access = $${values.length}::jsonb`);
    }
    if (patch.active !== undefined) {
      values.push(patch.active);
      sets.push(`active = $${values.length}`);
    }
    if (sets.length === 0) {
      const current = await queryOne<UserRow>("select * from users where id = $1", [id]);
      if (!current) throw new Error(`User ${id} not found`);
      return toUser(current);
    }
    values.push(id);
    const row = await queryOne<UserRow>(
      `update users set ${sets.join(", ")} where id = $${values.length} returning *`,
      values,
    );
    if (!row) throw new Error(`User ${id} not found`);
    return toUser(row);
  },
};
