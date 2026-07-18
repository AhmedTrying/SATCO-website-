"use client";

import { useState } from "react";

import type { CareersSource, FeatureFlags } from "@satco/shared";
import { LOADING_DURATION_MAX_MS } from "@satco/shared";

import { saveFlags } from "@/app/actions/flags";
import { SaveBar } from "@/components/form/SaveBar";
import { useSave } from "@/lib/use-save";

const SECTION_LABELS: Record<keyof FeatureFlags["section_visibility"], string> = {
  statBand: "Stat band",
  whoWeAre: "Who we are",
  careersTeaser: "Careers teaser",
  contactTeaser: "Contact teaser",
};

export function FlagsEditor({
  initial,
  canEdit,
}: {
  initial: FeatureFlags;
  canEdit: boolean;
}) {
  const [f, setF] = useState<FeatureFlags>(initial);
  const [dirty, setDirty] = useState(false);
  const save = useSave();
  function set<K extends keyof FeatureFlags>(k: K, v: FeatureFlags[K]) {
    setF((p) => ({ ...p, [k]: v }));
    setDirty(true);
    save.markDirty();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveFlags(f);
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Loading screen</h2>
          <div>
            <label className="label">
              Duration (ms) — capped at {LOADING_DURATION_MAX_MS} (locked, docx #2)
            </label>
            <input
              className="input max-w-[160px]"
              type="number"
              min={300}
              max={LOADING_DURATION_MAX_MS}
              step={100}
              aria-label="Loading duration in milliseconds"
              value={f.loading_duration_ms}
              onChange={(e) =>
                set(
                  "loading_duration_ms",
                  Math.min(LOADING_DURATION_MAX_MS, Number(e.target.value)),
                )
              }
            />
            <div className="hint">Fade-only spec is locked; the picker can&rsquo;t exceed 1.5s.</div>
          </div>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={f.show_review_control}
              onChange={(e) => set("show_review_control", e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-strong">
                Show the review-only timing switcher
              </span>
              <span className="block text-xs text-muted">
                A 1.2/1.5/2/3s comparison control for the Tarek-vs-Bandar timing
                debate (plan §12 Q15). Off for the live site.
              </span>
            </span>
          </label>
        </section>

        <section className="card space-y-2 p-4">
          <h2 className="text-sm font-semibold text-strong">Homepage sections</h2>
          {(Object.keys(SECTION_LABELS) as (keyof typeof SECTION_LABELS)[]).map(
            (key) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={f.section_visibility[key]}
                  onChange={(e) =>
                    set("section_visibility", {
                      ...f.section_visibility,
                      [key]: e.target.checked,
                    })
                  }
                />
                {SECTION_LABELS[key]}
              </label>
            ),
          )}
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Content switches</h2>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={f.show_pending_experience}
              onChange={(e) => set("show_pending_experience", e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-strong">
                Publish pending Selected Experience
              </span>
              <span className="block text-xs text-muted">
                The Construction / Operations / PPP go/no-go (plan §12 Q4). Mirrors
                the Sectors switch.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={f.show_vendor_tab}
              onChange={(e) => set("show_vendor_tab", e.target.checked)}
            />
            <span>
              <span className="block text-sm font-medium text-strong">
                Activate the vendors tab
              </span>
              <span className="block text-xs text-muted">
                Locked OFF for now (docx comment #4). Mirrors Site settings.
              </span>
            </span>
          </label>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Operational</h2>
          <div>
            <label className="label">Careers source</label>
            <select
              className="select max-w-[220px]"
              aria-label="Careers source"
              value={f.careers_source}
              onChange={(e) => set("careers_source", e.target.value as CareersSource)}
            >
              <option value="dashboard">Dashboard (source of truth)</option>
              <option value="linkedin">LinkedIn feed</option>
              <option value="ats">ATS feed</option>
            </select>
          </div>
          <div>
            <label className="label">Maintenance banner (blank = hidden)</label>
            <input
              className="input"
              aria-label="Maintenance banner (blank = hidden)"
              value={f.maintenance_banner ?? ""}
              placeholder="e.g. Scheduled maintenance Friday 22:00–23:00 AST"
              onChange={(e) =>
                set("maintenance_banner", e.target.value ? e.target.value : null)
              }
            />
          </div>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save flags"
      />
    </form>
  );
}
