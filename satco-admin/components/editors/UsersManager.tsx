"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { ROLES, type Role, type UserAccount } from "@satco/shared";

import { inviteUser, setUserActive, setUserRole } from "@/app/actions/users";

export function UsersManager({
  users,
  currentEmail,
}: {
  users: UserAccount[];
  currentEmail: string;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("editor");
  const [error, setError] = useState<string>();

  return (
    <div className="space-y-4">
      <form
        className="card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setError(undefined);
          start(async () => {
            const res = await inviteUser({ name, email, role });
            if (res.ok) {
              setName("");
              setEmail("");
              router.refresh();
            } else {
              setError(res.error);
            }
          });
        }}
      >
        <h2 className="mb-3 text-sm font-semibold text-strong">Invite a user</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <label className="label">Name</label>
            <input
              className="input"
              aria-label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select
              className="select"
              aria-label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="field-error mt-2">{error}</p>}
        <button type="submit" className="btn btn-primary mt-3">
          Invite
        </button>
        <p className="hint mt-2">
          Mock invite (no email). Supabase: a real invitation + Auth account.
        </p>
      </form>

      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.email === currentEmail;
              return (
                <tr key={u.id}>
                  <td className="font-medium text-strong">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="select h-7 w-auto py-0.5 text-xs"
                      value={u.role}
                      aria-label={`Role for ${u.name}`}
                      onChange={(e) =>
                        start(async () => {
                          await setUserRole(u.id, e.target.value as Role);
                          router.refresh();
                        })
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={u.active}
                        disabled={isSelf}
                        onChange={(e) =>
                          start(async () => {
                            await setUserActive(u.id, e.target.checked);
                            router.refresh();
                          })
                        }
                      />
                      {u.active ? "Active" : "Deactivated"}
                      {isSelf && <span className="text-muted">(you)</span>}
                    </label>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
