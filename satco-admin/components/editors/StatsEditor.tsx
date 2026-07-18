"use client";

import { useState } from "react";

import type { Stat } from "@satco/shared";

import { saveStats } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { useSave } from "@/lib/use-save";

export function StatsEditor({
  initial,
  canEdit,
}: {
  initial: Stat[];
  canEdit: boolean;
}) {
  const [stats, setStats] = useState<Stat[]>(initial);
  const [dirty, setDirty] = useState(false);
  const save = useSave();

  function patch(i: number, patch: Partial<Stat>) {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
    setDirty(true);
    save.markDirty();
  }

  function togglePending(i: number, pending: boolean) {
    // Stat #3: never invent a figure — pending sets value=null and display "—".
    patch(i, pending ? { value: null } : { value: 0 });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveStats(stats);
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <div className="space-y-3">
        {stats.map((s, i) => {
          const pending = s.value === null;
          return (
            <div key={s.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between">
                <code className="text-xs text-muted">{s.id}</code>
                <label className="flex items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={pending}
                    disabled={!canEdit}
                    onChange={(e) => togglePending(i, e.target.checked)}
                  />
                  Figure pending (no number)
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="label">Label</label>
                  <input
                    className="input"
                    aria-label="Label"
                    value={s.label}
                    disabled={!canEdit}
                    onChange={(e) => patch(i, { label: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">Display (shown text)</label>
                  <input
                    className="input"
                    aria-label="Display (shown text)"
                    value={s.display}
                    disabled={!canEdit}
                    onChange={(e) => patch(i, { display: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-4">
                <div>
                  <label className="label">Value {pending && "(pending)"}</label>
                  <input
                    className="input"
                    type="number"
                    step="any"
                    aria-label="Value"
                    value={pending ? "" : s.value ?? ""}
                    disabled={!canEdit || pending}
                    placeholder={pending ? "—" : ""}
                    onChange={(e) =>
                      patch(i, {
                        value: e.target.value === "" ? null : Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Suffix</label>
                  <input
                    className="input"
                    aria-label="Suffix"
                    value={s.suffix ?? ""}
                    disabled={!canEdit}
                    placeholder="K+ / M+"
                    onChange={(e) =>
                      patch(i, { suffix: e.target.value || undefined })
                    }
                  />
                </div>
                <div>
                  <label className="label">Unit</label>
                  <input
                    className="input"
                    aria-label="Unit"
                    value={s.unit ?? ""}
                    disabled={!canEdit}
                    placeholder="Persons / sqm"
                    onChange={(e) => patch(i, { unit: e.target.value || undefined })}
                  />
                </div>
                <div>
                  <label className="label">Decimals</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={3}
                    aria-label="Decimals"
                    value={s.decimals ?? ""}
                    disabled={!canEdit}
                    onChange={(e) =>
                      patch(i, {
                        decimals:
                          e.target.value === "" ? undefined : Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <label className="mt-3 flex items-center gap-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={s.countUp ?? false}
                  disabled={!canEdit || pending}
                  onChange={(e) => patch(i, { countUp: e.target.checked })}
                />
                Animate count-up
              </label>
            </div>
          );
        })}
      </div>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save stats"
      />
    </form>
  );
}
