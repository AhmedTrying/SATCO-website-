"use client";

import { useState } from "react";

import type { LeadershipMember, LeadershipPageCopy } from "@satco/shared";

import { saveLeadership } from "@/app/actions/content";
import { SaveBar } from "@/components/form/SaveBar";
import { useSave } from "@/lib/use-save";

export function AboutLeadership({
  page,
  members,
  canEdit,
}: {
  page: LeadershipPageCopy;
  members: LeadershipMember[];
  canEdit: boolean;
}) {
  const [p, setP] = useState<LeadershipPageCopy>(page);
  const [list, setList] = useState<LeadershipMember[]>(members);
  const [dirty, setDirty] = useState(false);
  const save = useSave();

  const touch = () => {
    setDirty(true);
    save.markDirty();
  };

  function setMember(i: number, patch: Partial<LeadershipMember>) {
    setList((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
    touch();
  }
  function add() {
    setList((prev) => [
      ...prev,
      {
        id: `person-${prev.length + 1}`,
        name: "",
        title: "",
        order: prev.length + 1,
      },
    ]);
    touch();
  }
  function remove(i: number) {
    setList((prev) => prev.filter((_, idx) => idx !== i));
    touch();
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.run(async () => {
          const res = await saveLeadership({ leadershipPage: p, leadership: list });
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
              <label className="label">Title</label>
              <input
                className="input"
                aria-label="Title"
                value={p.title}
                onChange={(e) => {
                  setP({ ...p, title: e.target.value });
                  touch();
                }}
              />
            </div>
            <div>
              <label className="label">
                Placeholder count (when no people are listed)
              </label>
              <input
                className="input"
                type="number"
                min={0}
                aria-label="Placeholder count (when no people are listed)"
                value={p.placeholderCount}
                onChange={(e) => {
                  setP({ ...p, placeholderCount: Number(e.target.value) });
                  touch();
                }}
              />
            </div>
          </div>
          <div>
            <label className="label">Subline</label>
            <textarea
              className="textarea"
              rows={2}
              aria-label="Subline"
              value={p.subline}
              onChange={(e) => {
                setP({ ...p, subline: e.target.value });
                touch();
              }}
            />
          </div>
          <div>
            <label className="label">Pending note</label>
            <input
              className="input"
              aria-label="Pending note"
              value={p.pendingNote}
              onChange={(e) => {
                setP({ ...p, pendingNote: e.target.value });
                touch();
              }}
            />
          </div>
        </section>

        <section className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              People ({list.length})
            </h2>
            <button type="button" className="btn btn-secondary text-xs" onClick={add}>
              + Add person
            </button>
          </div>
          {list.length === 0 && (
            <p className="text-xs text-muted">
              No people yet — the site shows {p.placeholderCount} placeholder cards
              (content TBD, plan §12 Q2). Add real profiles when provided.
            </p>
          )}
          <div className="space-y-3">
            {list.map((m, i) => (
              <div key={m.id} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <code className="text-xs text-muted">{m.id}</code>
                  <button
                    type="button"
                    className="btn btn-ghost px-2 text-error"
                    onClick={() => remove(i)}
                    aria-label={`Remove person ${i + 1}`}
                  >
                    ✕ Remove
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="label">Name</label>
                    <input
                      className="input"
                      aria-label="Name"
                      value={m.name}
                      onChange={(e) => setMember(i, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Title</label>
                    <input
                      className="input"
                      aria-label="Title"
                      value={m.title}
                      onChange={(e) => setMember(i, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="label">Order</label>
                    <input
                      className="input"
                      type="number"
                      aria-label="Order"
                      value={m.order}
                      onChange={(e) =>
                        setMember(i, { order: Number(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="label">Bio (optional)</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    aria-label="Bio (optional)"
                    value={m.bio ?? ""}
                    onChange={(e) =>
                      setMember(i, { bio: e.target.value || undefined })
                    }
                  />
                </div>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Photo key (optional)</label>
                    <input
                      className="input"
                      aria-label="Photo key (optional)"
                      value={m.photo?.src ?? ""}
                      onChange={(e) =>
                        setMember(i, {
                          photo: e.target.value
                            ? { src: e.target.value, alt: m.photo?.alt ?? "" }
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="label">Photo alt text</label>
                    <input
                      className="input"
                      aria-label="Photo alt text"
                      value={m.photo?.alt ?? ""}
                      disabled={!m.photo}
                      onChange={(e) =>
                        setMember(i, {
                          photo: m.photo
                            ? { ...m.photo, alt: e.target.value }
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </fieldset>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit={canEdit}
        error={save.error}
        label="Save leadership"
      />
    </form>
  );
}
