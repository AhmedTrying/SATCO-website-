/*
 * Local UserStore — the staff directory as data/{seed,store}/users.json.
 * Sessions are NOT stored here: see lib/auth/session.ts (signed cookie) and
 * lib/auth/google.ts (Google sign-in). This store only answers "who is allowed
 * in, with which role and page access".
 */

import type { AccessPage, Role, UserAccount } from "@satco/shared";

import type { UserStore } from "../types";
import { makeId, readStore, writeStore } from "./store";

const USERS = "users.json";

interface LegacyUser extends Omit<UserAccount, "role" | "access"> {
  role: Role | "recruiter";
  access?: AccessPage[];
  inboxes?: AccessPage[];
}

function normalise(raw: UserAccount): UserAccount {
  // Older stores: `inboxes` instead of `access`, and a `recruiter` role.
  const legacy = raw as unknown as LegacyUser;
  const { inboxes, role, access: stored, ...rest } = legacy;
  const access = Array.isArray(stored) ? stored : Array.isArray(inboxes) ? inboxes : [];
  if (role === "recruiter") {
    return { ...rest, role: "staff", access: access.includes("jobs") ? access : ["jobs", ...access] };
  }
  return { ...rest, role, access };
}

async function loadUsers(): Promise<UserAccount[]> {
  return (await readStore<UserAccount[]>(USERS)).map(normalise);
}

export const localUserStore: UserStore = {
  list: loadUsers,

  async getByEmail(email) {
    const wanted = email.trim().toLowerCase();
    return (await loadUsers()).find((u) => u.email.toLowerCase() === wanted);
  },

  async getById(id) {
    return (await loadUsers()).find((u) => u.id === id);
  },

  async create(input) {
    const users = await loadUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error(`An account already exists for ${input.email}`);
    }
    const user: UserAccount = {
      id: makeId("u"),
      name: input.name,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      access: input.access,
      active: true,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeStore(USERS, users);
    return user;
  },

  async update(id, patch) {
    const users = await loadUsers();
    const i = users.findIndex((u) => u.id === id);
    if (i < 0) throw new Error(`User ${id} not found`);
    users[i] = { ...users[i], ...patch };
    await writeStore(USERS, users);
    return users[i];
  },
};
