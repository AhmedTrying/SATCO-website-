"use client";

export type SaveState = "idle" | "saving" | "saved" | "error";

export function SaveBar({
  state,
  dirty,
  canEdit,
  error,
  label = "Save draft",
}: {
  state: SaveState;
  dirty: boolean;
  canEdit: boolean;
  error?: string;
  label?: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 mt-6 flex items-center justify-between gap-3 border-t border-border bg-surface/95 py-3 backdrop-blur">
      <div className="text-xs text-muted" role="status" aria-live="polite">
        {!canEdit && "Read-only — your role can't edit content."}
        {canEdit && state === "saved" && (
          <span className="text-success">✓ Saved to draft.</span>
        )}
        {canEdit && state === "error" && (
          <span className="text-error">{error || "Save failed."}</span>
        )}
        {canEdit && state === "idle" && dirty && "Unsaved changes."}
        {canEdit && state === "idle" && !dirty && "No changes."}
        {canEdit && state === "saving" && "Saving…"}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!canEdit || state === "saving" || !dirty}
      >
        {state === "saving" ? "Saving…" : label}
      </button>
    </div>
  );
}
