"use client";

import { useState } from "react";

import type { SiteContent } from "@satco/shared";
import { LOADING_TEXT_LOCKED } from "@satco/shared";

import { saveSite } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { useSave } from "@/lib/use-save";

export function SiteSettingsEditor({
  initial,
  canEdit,
}: {
  initial: SiteContent;
  canEdit: boolean;
}) {
  const [s, setS] = useState<SiteContent>(initial);
  const [dirty, setDirty] = useState(false);
  const save = useSave();
  function set<K extends keyof SiteContent>(k: K, v: SiteContent[K]) {
    setS((p) => ({ ...p, [k]: v }));
    setDirty(true);
    save.markDirty();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveSite(s);
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Identity</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input
                className="input"
                aria-label="Name"
                value={s.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Legal name</label>
              <input
                className="input"
                aria-label="Legal name"
                value={s.legalName}
                onChange={(e) => set("legalName", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Established (year)</label>
              <input
                className="input"
                type="number"
                aria-label="Established (year)"
                value={s.established}
                onChange={(e) => set("established", Number(e.target.value))}
              />
            </div>
            <div>
              <label className="label">Location</label>
              <input
                className="input"
                aria-label="Location"
                value={s.location}
                onChange={(e) => set("location", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Description (footer)</label>
            <textarea
              className="textarea"
              rows={2}
              aria-label="Description (footer)"
              value={s.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Copyright holder</label>
              <input
                className="input"
                aria-label="Copyright holder"
                value={s.copyrightHolder}
                onChange={(e) => set("copyrightHolder", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Established line</label>
              <input
                className="input"
                aria-label="Established line"
                value={s.establishedLine}
                onChange={(e) => set("establishedLine", e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Contact</h2>
          <StringList
            label="Address lines"
            values={s.contact.addressLines}
            onChange={(addressLines) =>
              set("contact", { ...s.contact, addressLines })
            }
            addLabel="Add address line"
          />
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              aria-label="Email"
              value={s.contact.email}
              onChange={(e) => set("contact", { ...s.contact, email: e.target.value })}
            />
          </div>
          <p className="hint">
            Address/phone/email are design-prototype placeholders (plan §12 Q6) —
            replace with the real details before launch.
          </p>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Locked values</h2>
          <div>
            <label className="label">Loading text (frozen — docx comment #2)</label>
            <input className="input" aria-label="Loading text (frozen — docx comment #2)" value={LOADING_TEXT_LOCKED} readOnly disabled />
            <div className="hint">
              Frozen by client sign-off — edit the loading duration in Features &
              settings instead.
            </div>
          </div>
          <label className="flex items-start gap-2.5">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={s.flags.showVendorsTab}
              onChange={(e) =>
                set("flags", { ...s.flags, showVendorsTab: e.target.checked })
              }
            />
            <span>
              <span className="block text-sm font-medium text-strong">
                Show vendors tab
              </span>
              <span className="block text-xs text-muted">
                Locked OFF (docx comment #4) — /vendors is reserved for future vendor
                registration and must stay unsurfaced.
              </span>
            </span>
          </label>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save site settings"
      />
    </form>
  );
}
