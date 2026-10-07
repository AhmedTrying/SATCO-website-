"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  ACCESS_PAGES,
  ROLES,
  type AccessPage,
  type Role,
  type UserAccount,
} from "@satco/shared";

import { addUser, setUserAccess, setUserActive, setUserRole } from "@/app/actions/users";
import { INQUIRY_LABELS } from "@/lib/routing";

/** Labels for the six grantable pages, in sidebar order. */
export const PAGE_LABELS: Record<AccessPage, string> = {
  jobs: "Jobs & applications",
  ...INQUIRY_LABELS,
};

function PagePicker({
  value,
  onChange,
  disabled,
  idPrefix,
  allLabel,
}: {
  value: AccessPage[];
  onChange: (next: AccessPage[]) => void;
  disabled?: boolean;
  idPrefix: string;
  allLabel?: string;
}) {
  if (allLabel) {
    return <span className="text-xs text-muted">{allLabel}</span>;
  }
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {ACCESS_PAGES.map((page) => {
        const id = `${idPrefix}-${page}`;
        const checked = value.includes(page);
        return (
          <label key={page} htmlFor={id} className="flex items-center gap-1.5 text-xs">
            <input
              id={id}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? ACCESS_PAGES.filter((p) => p === page || value.includes(p))
                    : value.filter((p) => p !== page),
                )
              }
            />
            {PAGE_LABELS[page]}
          </label>
        );
      })}
    </div>
  );
}

export function UsersManager({
  users,
  currentUserId,
  signInMode,
}: {
  users: UserAccount[];
  currentUserId: string;
  signInMode: "google" | "mock" | "none";
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [access, setAccess] = useState<AccessPage[]>([]);
  const [error, setError] = useState<string>();
  const [rowError, setRowError] = useState<string>();

  function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    start(async () => {
      const res = await action();
      setRowError(res.ok ? undefined : res.error);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <form
        className="card p-4"
        onSubmit={(e) => {
          e.preventDefault();
          setError(undefined);
          start(async () => {
            const res = await addUser({ name, email, role, access });
            if (res.ok) {
              setName("");
              setEmail("");
              setAccess([]);
              router.refresh();
            } else {
              setError(res.error);
            }
          });
        }}
      >
        <h2 className="mb-3 text-sm font-semibold text-strong">Add a user</h2>
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <label className="label" htmlFor="new-name">Name</label>
            <input
              id="new-name"
              className="input"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="new-email">Email</label>
            <input
              id="new-email"
              className="input"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="new-role">Role</label>
            <select
              id="new-role"
              className="select"
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
        <div className="mt-3">
          <span className="label">Page access</span>
          <PagePicker
            idPrefix="new"
            value={access}
            onChange={setAccess}
            allLabel={role === "admin" ? "Admins see every page." : undefined}
          />
        </div>
        {error && <p className="field-error mt-2">{error}</p>}
        <button type="submit" className="btn btn-primary mt-3" disabled={pending}>
          Add user
        </button>
        <p className="hint mt-2">
          {signInMode === "google"
            ? "They sign in with the Google account for this email. No invitation email is sent."
            : "Local mode: the account appears on the demo sign-in page."}
        </p>
      </form>

      {rowError && <p className="field-error">{rowError}</p>}

      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Page access</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <tr key={u.id}>
                  <td>
                    <div className="font-medium text-strong">
                      {u.name}
                      {isSelf && <span className="ms-1 text-xs font-normal text-muted">(you)</span>}
                    </div>
                    <div className="text-[0.7rem] text-muted">{u.email}</div>
                  </td>
                  <td>
                    <select
                      className="select h-7 w-auto py-0.5 text-xs"
                      value={u.role}
                      aria-label={`Role for ${u.name}`}
                      disabled={pending}
                      onChange={(e) => run(() => setUserRole(u.id, e.target.value as Role))}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <PagePicker
                      idPrefix={u.id}
                      value={u.access}
                      disabled={pending}
                      onChange={(next) => run(() => setUserAccess(u.id, next))}
                      allLabel={u.role === "admin" ? "All pages (admin)" : undefined}
                    />
                  </td>
                  <td>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={u.active}
                        disabled={isSelf || pending}
                        onChange={(e) => run(() => setUserActive(u.id, e.target.checked))}
                      />
                      {u.active ? "Active" : "Deactivated"}
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
