"use client";

import { useState } from "react";

import type { Capability, Sector } from "@satco/shared";

import { saveSector } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { useSave } from "@/lib/use-save";

function Labeled({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  // Wrapping label → implicit association with the control (a11y 1.3.1/4.1.2).
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="hint block">{hint}</span>}
    </label>
  );
}

export function SectorEditor({
  initial,
  canEdit,
}: {
  initial: Sector;
  canEdit: boolean;
}) {
  const [s, setS] = useState<Sector>(initial);
  const [dirty, setDirty] = useState(false);
  const save = useSave();

  function set<K extends keyof Sector>(key: K, value: Sector[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    save.markDirty();
  }

  function setCap(i: number, patch: Partial<Capability>) {
    set(
      "capabilities",
      s.capabilities.map((c, idx) => (idx === i ? { ...c, ...patch } : c)),
    );
  }
  function addCap() {
    set("capabilities", [
      ...s.capabilities,
      { id: `cap-${s.capabilities.length + 1}`, title: "", body: "" },
    ]);
  }
  function removeCap(i: number) {
    set(
      "capabilities",
      s.capabilities.filter((_, idx) => idx !== i),
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveSector(s.slug, s);
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        {/* Identity */}
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Overview</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Full name">
              <input
                className="input"
                value={s.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </Labeled>
            <Labeled label="Short name">
              <input
                className="input"
                value={s.shortName}
                onChange={(e) => set("shortName", e.target.value)}
              />
            </Labeled>
          </div>
          <Labeled label="Tagline (hero one-liner)">
            <input
              className="input"
              value={s.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </Labeled>
          <Labeled label="L1 overview (short)">
            <textarea
              className="textarea"
              rows={3}
              value={s.overviewShort}
              onChange={(e) => set("overviewShort", e.target.value)}
            />
          </Labeled>
          <Labeled
            label="L2 overview"
            hint="Paragraphs separated by a blank line (\n\n). Verbatim copy."
          >
            <textarea
              className="textarea"
              rows={6}
              value={s.overview}
              onChange={(e) => set("overview", e.target.value)}
            />
          </Labeled>
        </section>

        {/* Capabilities repeater */}
        <section className="card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Core capabilities ({s.capabilities.length})
            </h2>
            <button
              type="button"
              className="btn btn-secondary text-xs"
              onClick={addCap}
            >
              + Add capability
            </button>
          </div>
          {s.capabilities.length === 0 && (
            <p className="text-xs text-muted">
              No titled capabilities. PPP uses the prose block below instead.
            </p>
          )}
          {s.capabilities.map((c, i) => (
            <div key={c.id} className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center justify-between">
                <code className="text-xs text-muted">{c.id}</code>
                <button
                  type="button"
                  className="btn btn-ghost px-2 text-error"
                  onClick={() => removeCap(i)}
                  aria-label={`Remove capability ${i + 1}`}
                >
                  ✕ Remove
                </button>
              </div>
              <Labeled label="Title">
                <input
                  className="input"
                  value={c.title}
                  onChange={(e) => setCap(i, { title: e.target.value })}
                />
              </Labeled>
              <div className="mt-2">
                <Labeled label="Body (verbatim copy)">
                  <textarea
                    className="textarea"
                    rows={4}
                    value={c.body}
                    onChange={(e) => setCap(i, { body: e.target.value })}
                  />
                </Labeled>
              </div>
            </div>
          ))}
          <Labeled
            label="Capabilities prose (PPP only — optional)"
            hint="A single prose block used instead of titled cards."
          >
            <textarea
              className="textarea"
              rows={3}
              value={s.capabilitiesProse ?? ""}
              onChange={(e) =>
                set("capabilitiesProse", e.target.value || undefined)
              }
            />
          </Labeled>
        </section>

        {/* Delivery */}
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Delivery models</h2>
          <Labeled label="Heading">
            <input
              className="input"
              value={s.delivery.heading}
              onChange={(e) =>
                set("delivery", { ...s.delivery, heading: e.target.value })
              }
            />
          </Labeled>
          <StringList
            label="Models"
            values={s.delivery.models}
            onChange={(models) => set("delivery", { ...s.delivery, models })}
            placeholder="e.g. Design–Build"
            addLabel="Add model"
          />
          <Labeled label="Description (verbatim copy)">
            <textarea
              className="textarea"
              rows={4}
              value={s.delivery.description}
              onChange={(e) =>
                set("delivery", { ...s.delivery, description: e.target.value })
              }
            />
          </Labeled>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!s.delivery.secondary}
              onChange={(e) =>
                set("delivery", {
                  ...s.delivery,
                  secondary: e.target.checked
                    ? s.delivery.secondary ?? { title: "", body: "" }
                    : undefined,
                })
              }
            />
            Include a secondary block
          </label>
          {s.delivery.secondary && (
            <div className="rounded-md border border-border p-3">
              <Labeled label="Secondary title">
                <input
                  className="input"
                  value={s.delivery.secondary.title}
                  onChange={(e) =>
                    set("delivery", {
                      ...s.delivery,
                      secondary: {
                        ...s.delivery.secondary!,
                        title: e.target.value,
                      },
                    })
                  }
                />
              </Labeled>
              <div className="mt-2">
                <Labeled label="Secondary body">
                  <textarea
                    className="textarea"
                    rows={3}
                    value={s.delivery.secondary.body}
                    onChange={(e) =>
                      set("delivery", {
                        ...s.delivery,
                        secondary: {
                          ...s.delivery.secondary!,
                          body: e.target.value,
                        },
                      })
                    }
                  />
                </Labeled>
              </div>
            </div>
          )}
        </section>

        {/* Selected Experience */}
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Selected Experience</h2>
          <Labeled
            label="Status"
            hint="Construction / Operations / PPP are pending a client go/no-go (plan §12 Q4)."
          >
            <select
              className="select"
              value={s.experience.status}
              onChange={(e) =>
                set("experience", {
                  ...s.experience,
                  status: e.target.value as Sector["experience"]["status"],
                })
              }
            >
              <option value="confirmed">Confirmed (publishes now)</option>
              <option value="pending-decision">
                Pending decision (shows the interim card unless the flag is on)
              </option>
            </select>
          </Labeled>
          <Labeled label="Experience heading (optional)">
            <input
              className="input"
              value={s.experienceHeading ?? ""}
              onChange={(e) =>
                set("experienceHeading", e.target.value || undefined)
              }
            />
          </Labeled>
          <Labeled label="Body (verbatim draft copy)">
            <textarea
              className="textarea"
              rows={6}
              value={s.experience.body}
              onChange={(e) =>
                set("experience", { ...s.experience, body: e.target.value })
              }
            />
          </Labeled>
        </section>

        {/* Why + mobile */}
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Why SATCO & mobile</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Why label" hint='Case-sensitive (e.g. "PPP").'>
              <input
                className="input"
                value={s.whyLabel}
                onChange={(e) => set("whyLabel", e.target.value)}
              />
            </Labeled>
            <Labeled label="Contact CTA">
              <input
                className="input"
                value={s.contactCta}
                onChange={(e) => set("contactCta", e.target.value)}
              />
            </Labeled>
          </div>
          <Labeled label="Why SATCO (verbatim copy)">
            <textarea
              className="textarea"
              rows={4}
              value={s.whySatco}
              onChange={(e) => set("whySatco", e.target.value)}
            />
          </Labeled>
          <Labeled label="Mobile CTA">
            <input
              className="input"
              value={s.mobileCta}
              onChange={(e) => set("mobileCta", e.target.value)}
            />
          </Labeled>
          <Labeled label="Mobile summary (verbatim copy)">
            <textarea
              className="textarea"
              rows={6}
              value={s.mobileSummary}
              onChange={(e) => set("mobileSummary", e.target.value)}
            />
          </Labeled>
        </section>

        {/* Images */}
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Images</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Hero image key">
              <input
                className="input"
                value={s.hero.src}
                onChange={(e) => set("hero", { ...s.hero, src: e.target.value })}
              />
            </Labeled>
            <Labeled label="Hero position (CSS object-position)">
              <input
                className="input"
                value={s.heroPosition ?? ""}
                placeholder="center 42%"
                onChange={(e) => set("heroPosition", e.target.value || undefined)}
              />
            </Labeled>
          </div>
          <Labeled label="Hero alt text (required for a11y)">
            <input
              className="input"
              value={s.hero.alt}
              onChange={(e) => set("hero", { ...s.hero, alt: e.target.value })}
            />
          </Labeled>
          <div className="grid gap-3 sm:grid-cols-2">
            <Labeled label="Card image key">
              <input
                className="input"
                value={s.card.src}
                onChange={(e) => set("card", { ...s.card, src: e.target.value })}
              />
            </Labeled>
            <Labeled label="Card alt text (required for a11y)">
              <input
                className="input"
                value={s.card.alt}
                onChange={(e) => set("card", { ...s.card, alt: e.target.value })}
              />
            </Labeled>
          </div>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save sector"
      />
    </form>
  );
}
