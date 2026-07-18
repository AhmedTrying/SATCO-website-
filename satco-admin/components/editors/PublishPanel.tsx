"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { publishAction } from "@/app/actions/publish";

export function PublishPanel({
  changedCount,
  canPublish,
}: {
  changedCount: number;
  canPublish: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string>();
  const [error, setError] = useState<string>();

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-strong">Publish to the site</h2>
          <p className="mt-0.5 text-xs text-muted">
            Writes <code>satco-web/content/generated/*.json</code>. Then rebuild the
            site: <code>npm --workspace satco-web run build</code>. (Later: a
            debounced deploy hook does this automatically.)
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canPublish || pending || changedCount === 0}
          onClick={() =>
            start(async () => {
              setError(undefined);
              setMsg(undefined);
              const res = await publishAction();
              if (res.ok) {
                setMsg(
                  res.record?.changedKeys.length
                    ? `Published ${res.record.changedKeys.length} change group(s).`
                    : "Published (no changes).",
                );
                router.refresh();
              } else {
                setError(res.error);
              }
            })
          }
        >
          {pending ? "Publishing…" : `Publish ${changedCount} change${changedCount === 1 ? "" : "s"}`}
        </button>
      </div>
      {!canPublish && (
        <p className="mt-2 text-xs text-muted">
          Your role can&rsquo;t publish — needs publisher or admin.
        </p>
      )}
      {msg && <p className="mt-2 text-xs text-success">✓ {msg}</p>}
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
