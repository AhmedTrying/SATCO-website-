"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { ROLES, type Role } from "@satco/shared";

import { setRoleAction } from "@/app/actions/auth";

/**
 * Mock-only role switcher (dashboard kickoff §3) — preview viewer/editor/
 * publisher/admin permissions without separate accounts. Removed when Supabase
 * Auth provides real roles.
 */
export function RoleSwitcher({ role }: { role: Role }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <label className="flex items-center gap-2 text-xs">
      <span className="hidden text-muted sm:inline">Preview role</span>
      <select
        className="select h-8 w-auto py-1 text-xs"
        value={role}
        disabled={pending}
        aria-label="Preview role"
        onChange={(e) => {
          const next = e.target.value as Role;
          startTransition(async () => {
            await setRoleAction(next);
            router.refresh();
          });
        }}
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r[0].toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}
