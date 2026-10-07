import { redirect } from "next/navigation";

import { mockSignInAction } from "@/app/actions/auth";
import { Emblem } from "@/components/ui/Emblem";
import { adapters } from "@/lib/adapters";
import { authMode, getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  "no-account":
    "That Google account is not on the staff list. Ask an admin to add your email under Users & access.",
  "wrong-domain": "Sign in with your SATCO Google Workspace account.",
  "email-unverified": "Google has not verified that email address.",
  "state-mismatch": "The sign-in link expired. Please try again.",
  "google-denied": "Google sign-in was cancelled.",
  "google-failed": "Google sign-in failed. Please try again.",
  "google-not-configured": "Google sign-in is not configured on this server.",
  "mock-disabled": "Demo sign-in is disabled here. Use Google sign-in.",
};

const ROLE_BLURB: Record<string, string> = {
  admin: "Everything: careers, every inbox, users & access.",
  staff: "Only the pages granted to this account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/overview");
  const mode = authMode();
  const { error } = await searchParams;
  const users = mode === "mock" ? await adapters.users.list() : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-5 flex items-center gap-2.5">
          <Emblem size={30} />
          <div>
            <div className="text-lg font-bold tracking-[0.16em] text-strong">SATCO</div>
            <div className="text-xs uppercase tracking-wide text-muted">
              Operations dashboard
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h1 className="text-base font-semibold text-strong">Sign in</h1>

          {error && (
            <p role="alert" className="mt-3 rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
              {ERRORS[error] ?? "Sign-in failed. Please try again."}
            </p>
          )}

          {mode === "google" && (
            <>
              <p className="mt-1 text-xs text-muted">
                Use your SATCO Google account. Access is limited to staff listed in
                the dashboard.
              </p>
              <a href="/api/auth/google" className="btn btn-primary mt-4 w-full">
                Continue with Google
              </a>
            </>
          )}

          {mode === "mock" && (
            <>
              <p className="mt-1 text-xs text-muted">
                Demo sign-in (design phase). Pick an account; its role and page
                access come from Users &amp; access.
              </p>
              <div className="mt-4 space-y-2">
                {users
                  .filter((u) => u.active)
                  .map((u) => (
                    <form key={u.id} action={mockSignInAction}>
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
              <p className="mt-4 text-[0.7rem] text-muted">
                No password is asked for. Switch to Google sign-in before the site
                goes public (see docs/DASHBOARD.md).
              </p>
            </>
          )}

          {mode === "none" && (
            <p className="mt-3 text-sm text-muted">
              Sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
              on the server (see .env.example).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
