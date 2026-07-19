/*
 * Neon AuthProvider — the same cookie session + role switcher as MockAuth, but the
 * staff directory is backed by the Postgres `users` table instead of a JSON file.
 *
 * Neon is a database, not an auth provider, so the dev sign-in / role-preview model
 * is unchanged; a real IdP (Supabase Auth / M365 SSO) can adopt this same `users`
 * table later (profiles.role → role) without touching call sites. The interface and
 * every consumer stay identical to the local backend.
 */

import { cookies } from "next/headers";

import type { Role, UserAccount } from "@satco/shared";

import type { AuthProvider, Session } from "../types";
import { makeId } from "../local/store";
import { query, queryOne } from "../../db";
import { toUser, type UserRow } from "./mappers";

const COOKIE = "satco_admin_session";

async function loadUsers(): Promise<UserAccount[]> {
  const rows = await query<UserRow>("select * from users order by seq asc");
  return rows.map(toUser);
}

export const neonAuth: AuthProvider = {
  async getSession(): Promise<Session | null> {
    const jar = await cookies();
    const raw = jar.get(COOKIE)?.value;
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Session;
      if (!parsed?.userId || !parsed?.role) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  async signIn(email: string): Promise<Session> {
    const row = await queryOne<UserRow>(
      "select * from users where lower(email) = lower($1) and active = true",
      [email],
    );
    if (!row) {
      throw new Error(`No active account for ${email}`);
    }
    const user = toUser(row);
    const session: Session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const jar = await cookies();
    jar.set(COOKIE, JSON.stringify(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return session;
  },

  async signOut(): Promise<void> {
    const jar = await cookies();
    jar.delete(COOKIE);
  },

  async setRole(role: Role): Promise<Session> {
    const jar = await cookies();
    const raw = jar.get(COOKIE)?.value;
    if (!raw) throw new Error("Not signed in");
    const session = JSON.parse(raw) as Session;
    const next: Session = { ...session, role };
    jar.set(COOKIE, JSON.stringify(next), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return next;
  },

  listUsers(): Promise<UserAccount[]> {
    return loadUsers();
  },

  async createUser(input): Promise<UserAccount> {
    const existing = await queryOne<{ id: string }>(
      "select id from users where lower(email) = lower($1)",
      [input.email],
    );
    if (existing) {
      throw new Error(`An account already exists for ${input.email}`);
    }
    const user: UserAccount = {
      id: makeId("u"),
      name: input.name,
      email: input.email,
      role: input.role,
      active: true,
      createdAt: new Date().toISOString(),
    };
    await query(
      `insert into users (id, name, email, role, active, created_at)
       values ($1, $2, $3, $4, $5, $6)`,
      [user.id, user.name, user.email, user.role, user.active, user.createdAt],
    );
    return user;
  },

  async updateUser(id, patch): Promise<UserAccount> {
    const sets: string[] = [];
    const values: unknown[] = [];
    if (patch.role !== undefined) {
      values.push(patch.role);
      sets.push(`role = $${values.length}`);
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
