/*
 * MockAuth — the local AuthProvider (dashboard kickoff §3).
 * A cookie-backed dev login plus a role switcher so permissions can be previewed
 * without real accounts. TODO(supabase): replace with Supabase Auth + a
 * profiles.role lookup; the interface and every call site stay the same.
 */

import { cookies } from "next/headers";

import type { Role, UserAccount } from "@satco/shared";

import type { AuthProvider, Session } from "../types";
import { makeId, readStore, writeStore } from "./store";

const COOKIE = "satco_admin_session";
const USERS = "users.json";

async function loadUsers(): Promise<UserAccount[]> {
  return readStore<UserAccount[]>(USERS);
}

export const mockAuth: AuthProvider = {
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
    const users = await loadUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.active,
    );
    if (!user) {
      throw new Error(`No active account for ${email}`);
    }
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
    const users = await loadUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
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
    users.push(user);
    await writeStore(USERS, users);
    return user;
  },

  async updateUser(id, patch): Promise<UserAccount> {
    const users = await loadUsers();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error(`User ${id} not found`);
    users[i] = { ...users[i], ...patch };
    await writeStore(USERS, users);
    return users[i];
  },
};
