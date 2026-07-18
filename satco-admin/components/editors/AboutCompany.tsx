"use client";

import { useState } from "react";

import type { CompanyContent } from "@satco/shared";

import { saveCompany } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { useSave } from "@/lib/use-save";

export function AboutCompany({
  initial,
  canEdit,
}: {
  initial: CompanyContent;
  canEdit: boolean;
}) {
  const [c, setC] = useState<CompanyContent>(initial);
  const [dirty, setDirty] = useState(false);
  const save = useSave();

  function set<K extends keyof CompanyContent>(k: K, v: CompanyContent[K]) {
    setC((p) => ({ ...p, [k]: v }));
    setDirty(true);
    save.markDirty();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveCompany(c);
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        <section className="card space-y-3 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Page title</label>
              <input
                className="input"
                aria-label="Page title"
                value={c.title}
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div>
              <label className="label">Eyebrow</label>
              <input
                className="input"
                aria-label="Eyebrow"
                value={c.eyebrow}
                onChange={(e) => set("eyebrow", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="label">Heading</label>
            <input
              className="input"
              aria-label="Heading"
              value={c.heading}
              onChange={(e) => set("heading", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Sectors link heading</label>
            <input
              className="input"
              aria-label="Sectors link heading"
              value={c.sectorsLinkHeading}
              onChange={(e) => set("sectorsLinkHeading", e.target.value)}
            />
          </div>
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">
            Company information (verbatim copy — one entry per paragraph)
          </h2>
          <StringList
            values={c.paragraphs}
            onChange={(paragraphs) => set("paragraphs", paragraphs)}
            multiline
            placeholder="Paragraph text…"
            addLabel="Add paragraph"
          />
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Facts</h2>
          <div className="space-y-2">
            {c.facts.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="input"
                  aria-label={`Fact ${i + 1} value`}
                  value={f.value}
                  placeholder="1975"
                  onChange={(e) =>
                    set(
                      "facts",
                      c.facts.map((x, idx) =>
                        idx === i ? { ...x, value: e.target.value } : x,
                      ),
                    )
                  }
                />
                <input
                  className="input"
                  aria-label={`Fact ${i + 1} label`}
                  value={f.label}
                  placeholder="Established"
                  onChange={(e) =>
                    set(
                      "facts",
                      c.facts.map((x, idx) =>
                        idx === i ? { ...x, label: e.target.value } : x,
                      ),
                    )
                  }
                />
                <button
                  type="button"
                  className="btn btn-ghost px-2 text-error"
                  aria-label={`Remove fact ${i + 1}`}
                  onClick={() =>
                    set(
                      "facts",
                      c.facts.filter((_, idx) => idx !== i),
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-secondary mt-2 text-xs"
            onClick={() => set("facts", [...c.facts, { value: "", label: "" }])}
          >
            + Add fact
          </button>
        </section>

        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Image</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Image key</label>
              <input
                className="input"
                aria-label="Image key"
                value={c.image.src}
                onChange={(e) => set("image", { ...c.image, src: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Alt text (required for a11y)</label>
              <input
                className="input"
                aria-label="Alt text (required for a11y)"
                value={c.image.alt}
                onChange={(e) => set("image", { ...c.image, alt: e.target.value })}
              />
            </div>
          </div>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save company info"
      />
    </form>
  );
}
