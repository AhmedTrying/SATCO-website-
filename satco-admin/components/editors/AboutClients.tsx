"use client";

import { useState } from "react";

import type { Client, ClientsPageCopy } from "@satco/shared";

import { saveClients } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { useSave } from "@/lib/use-save";

const SELECTED_MAX = 30;

export function AboutClients({
  page,
  clients,
  canEdit,
}: {
  page: ClientsPageCopy;
  clients: Client[];
  canEdit: boolean;
}) {
  const [p, setP] = useState<ClientsPageCopy>(page);
  const [selected, setSelected] = useState<Client[]>(
    clients.filter((c) => c.tier === "selected"),
  );
  const [directory, setDirectory] = useState<string[]>(
    clients.filter((c) => c.tier === "directory").map((c) => c.name),
  );
  const [dirty, setDirty] = useState(false);
  const save = useSave();
  const touch = () => {
    setDirty(true);
    save.markDirty();
  };

  const overCap = selected.length > SELECTED_MAX;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const rebuilt: Client[] = [
            ...selected,
            ...directory
              .filter((n) => n.trim())
              .map((name, i): Client => ({
                id: `dir-${i}`,
                name,
                tier: "directory",
              })),
          ];
          const res = await saveClients({ clientsPage: p, clients: rebuilt });
          if (res.ok) setDirty(false);
          return res;
        });
      }}
    >
      <fieldset disabled={!canEdit} className="space-y-4">
        <section className="card space-y-3 p-4">
          <h2 className="text-sm font-semibold text-strong">Page copy</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Selected heading</label>
              <input
                className="input"
                aria-label="Selected heading"
                value={p.selectedHeading}
                onChange={(e) => {
                  setP({ ...p, selectedHeading: e.target.value });
                  touch();
                }}
              />
            </div>
            <div>
              <label className="label">Directory heading</label>
              <input
                className="input"
                aria-label="Directory heading"
                value={p.directoryHeading}
                onChange={(e) => {
                  setP({ ...p, directoryHeading: e.target.value });
                  touch();
                }}
              />
            </div>
          </div>
          <div>
            <label className="label">Disclaimer (verbatim — legal text, do not reword)</label>
            <textarea
              className="textarea"
              rows={3}
              aria-label="Disclaimer (verbatim — legal text, do not reword)"
              value={p.disclaimer}
              onChange={(e) => {
                setP({ ...p, disclaimer: e.target.value });
                touch();
              }}
            />
            <div className="hint">
              Docx comment #31 marks this &ldquo;exact language, use verbatim.&rdquo;
            </div>
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Selected clients — logo grid
            </h2>
            <span className={overCap ? "badge badge-red" : "badge badge-stone"}>
              {selected.length} / {SELECTED_MAX}
            </span>
          </div>
          <p className="mb-3 text-xs text-muted">
            Rendered <strong>grayscale</strong>, unlinked, equal weight — hard max{" "}
            {SELECTED_MAX} (docx comment #31). Logos are managed in the Media library.
          </p>
          {overCap && (
            <p className="field-error mb-2">
              Over the {SELECTED_MAX}-logo cap — remove {selected.length - SELECTED_MAX}.
            </p>
          )}
          <div className="space-y-2">
            {selected.map((c, i) => (
              <div
                key={c.id}
                className="grid items-center gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]"
              >
                <input
                  className="input"
                  aria-label={`Selected client ${i + 1} name`}
                  value={c.name}
                  placeholder="Client name"
                  onChange={(e) => {
                    setSelected(
                      selected.map((x, idx) =>
                        idx === i ? { ...x, name: e.target.value } : x,
                      ),
                    );
                    touch();
                  }}
                />
                <input
                  className="input"
                  aria-label={`Selected client ${i + 1} logo key`}
                  value={c.logo?.src ?? ""}
                  placeholder="logo key (optional)"
                  onChange={(e) => {
                    setSelected(
                      selected.map((x, idx) =>
                        idx === i
                          ? {
                              ...x,
                              logo: e.target.value
                                ? { src: e.target.value, alt: x.logo?.alt ?? `${x.name} logo` }
                                : undefined,
                            }
                          : x,
                      ),
                    );
                    touch();
                  }}
                />
                <input
                  className="input"
                  aria-label={`Selected client ${i + 1} logo alt`}
                  value={c.logo?.alt ?? ""}
                  placeholder="logo alt text"
                  disabled={!c.logo}
                  onChange={(e) => {
                    setSelected(
                      selected.map((x, idx) =>
                        idx === i && x.logo
                          ? { ...x, logo: { ...x.logo, alt: e.target.value } }
                          : x,
                      ),
                    );
                    touch();
                  }}
                />
                <button
                  type="button"
                  className="btn btn-ghost px-2 text-error"
                  aria-label={`Remove selected client ${i + 1}`}
                  onClick={() => {
                    setSelected(selected.filter((_, idx) => idx !== i));
                    touch();
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-secondary mt-2 text-xs"
            disabled={selected.length >= SELECTED_MAX}
            onClick={() => {
              setSelected([
                ...selected,
                { id: `sel-${selected.length}`, name: "", tier: "selected" },
              ]);
              touch();
            }}
          >
            + Add selected client
          </button>
        </section>

        <section className="card p-4">
          <h2 className="mb-1 text-sm font-semibold text-strong">
            Full client directory (A–Z, text only)
          </h2>
          <p className="mb-3 text-xs text-muted">
            Searchable text list — no logos, unlimited entries ({directory.length}).
          </p>
          <StringList
            values={directory}
            onChange={(v) => {
              setDirectory(v);
              touch();
            }}
            placeholder="Organization name"
            addLabel="Add directory entry"
          />
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save clients"
      />
    </form>
  );
}
