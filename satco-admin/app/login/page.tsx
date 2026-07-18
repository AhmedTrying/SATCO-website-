import { redirect } from "next/navigation";

import { signInAction } from "@/app/actions/auth";
import { Emblem } from "@/components/ui/Emblem";
import { adapters } from "@/lib/adapters";

export const dynamic = "force-dynamic";

const ROLE_BLURB: Record<string, string> = {
  admin: "Full access — users, roles, settings, flags, destructive actions.",
  publisher: "Publish + rebuild, jobs, submissions, CV downloads.",
  editor: "Create and edit drafts, upload media.",
  viewer: "Read-only — see the dashboard and drafts.",
};

export default async function LoginPage() {
  const session = await adapters.auth.getSession();
  if (session) redirect("/overview");
  const users = await adapters.auth.listUsers();

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center gap-2.5">
          <Emblem size={30} />
          <div>
            <div className="text-lg font-semibold text-strong">SATCO</div>
            <div className="text-xs uppercase tracking-wide text-muted">
              Control dashboard
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h1 className="text-base font-semibold text-strong">Sign in</h1>
          <p className="mt-1 text-xs text-muted">
            Mock authentication (Supabase Auth deferred). Choose a demo account —
            you can switch roles anytime from the top bar.
          </p>

          <div className="mt-4 space-y-2">
            {users.map((u) => (
              <form key={u.id} action={signInAction}>
                <input type="hidden" name="email" value={u.email} />
                <button
                  type="submit"
                  className="flex w-full items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5 text-start transition-colors hover:border-bronze-300 hover:bg-bronze-50"
                >
                  <span>
                    <span className="block text-sm font-medium text-strong">
                      {u.name}
                    </span>
                    <span className="block text-xs text-muted">
                      {ROLE_BLURB[u.role]}
                    </span>
                  </span>
                  <span className="badge badge-stone capitalize">{u.role}</span>
                </button>
              </form>
            ))}
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <form action={signInAction} className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="email" className="label">
                  Or sign in by email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="input"
                  placeholder="admin@satco.com.sa"
                  autoComplete="username"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>
            </form>
          </div>
        </div>

        <p className="mt-3 text-center text-[0.7rem] text-muted">
          No passwords are handled here — this is a local development stand-in.
        </p>
      </div>
    </div>
  );
}
