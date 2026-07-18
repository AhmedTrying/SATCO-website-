"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type { JobRecord, JobState, SectorSlug } from "@satco/shared";

import { deleteJob, saveJob, setJobState } from "@/app/actions/jobs";
import { SaveBar } from "@/components/form/SaveBar";
import { StringList } from "@/components/form/StringList";
import { statusBadgeClass, titleCase } from "@/lib/format";
import { useSave } from "@/lib/use-save";

const SECTORS: SectorSlug[] = ["airports", "construction", "operations", "ppp"];
const LEVELS = ["entry", "mid", "senior", "lead", "executive"] as const;
const STATES: JobState[] = ["draft", "open", "closed"];

function blankJob(): JobRecord {
  return {
    id: "",
    slug: "",
    title: "",
    location: "",
    sector: "construction",
    discipline: "",
    experienceLevel: "mid",
    summary: "",
    responsibilities: [""],
    requirements: [""],
    applyHref: "https://careers.satco.com.sa/apply",
    source: "mock",
    state: "draft",
    createdAt: "",
    updatedAt: "",
  };
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function JobEditor({
  initial,
  onDone,
}: {
  initial: JobRecord;
  onDone: () => void;
}) {
  const router = useRouter();
  const [j, setJ] = useState<JobRecord>(initial);
  const [dirty, setDirty] = useState(initial.id === "");
  const save = useSave();
  const isNew = initial.id === "";

  function set<K extends keyof JobRecord>(k: K, v: JobRecord[K]) {
    setJ((p) => ({ ...p, [k]: v }));
    setDirty(true);
    save.markDirty();
  }

  return (
    <form
      className="card mb-4 space-y-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const payload = { ...j, slug: j.slug || slugify(j.title) };
        save.run(async () => {
          const res = await saveJob(payload);
          if (res.ok) {
            router.refresh();
            onDone();
          }
          return res;
        });
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-strong">
          {isNew ? "New job" : `Edit: ${initial.title}`}
        </h2>
        <button type="button" className="btn btn-ghost text-xs" onClick={onDone}>
          Close
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            aria-label="Title"
            value={j.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Slug (auto from title if blank)</label>
          <input
            className="input"
            aria-label="Slug (auto from title if blank)"
            value={j.slug}
            placeholder={slugify(j.title)}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Location</label>
          <input
            className="input"
            aria-label="Location"
            value={j.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Discipline</label>
          <input
            className="input"
            aria-label="Discipline"
            value={j.discipline}
            onChange={(e) => set("discipline", e.target.value)}
          />
        </div>
        <div>
          <label className="label">Sector</label>
          <select
            className="select"
            aria-label="Sector"
            value={j.sector}
            onChange={(e) => set("sector", e.target.value as SectorSlug)}
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Experience level</label>
          <select
            className="select"
            aria-label="Experience level"
            value={j.experienceLevel}
            onChange={(e) =>
              set("experienceLevel", e.target.value as JobRecord["experienceLevel"])
            }
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Summary</label>
        <textarea
          className="textarea"
          rows={2}
          aria-label="Summary"
          value={j.summary}
          onChange={(e) => set("summary", e.target.value)}
        />
      </div>

      <StringList
        label="Responsibilities"
        values={j.responsibilities}
        onChange={(v) => set("responsibilities", v)}
        multiline
        addLabel="Add responsibility"
      />
      <StringList
        label="Requirements"
        values={j.requirements}
        onChange={(v) => set("requirements", v)}
        multiline
        addLabel="Add requirement"
      />

      <div>
        <label className="label">Apply URL</label>
        <input
          className="input"
          aria-label="Apply URL"
          value={j.applyHref}
          onChange={(e) => set("applyHref", e.target.value)}
        />
        <div className="hint">
          Must be a live ATS/LinkedIn URL — no PDF or mailto (docx comment #42).
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">Source</label>
          <select
            className="select"
            aria-label="Source"
            value={j.source}
            onChange={(e) =>
              set("source", e.target.value as JobRecord["source"])
            }
          >
            <option value="mock">mock</option>
            <option value="linkedin">linkedin</option>
            <option value="ats">ats</option>
          </select>
        </div>
        <div>
          <label className="label">State</label>
          <select
            className="select"
            aria-label="State"
            value={j.state}
            onChange={(e) => set("state", e.target.value as JobState)}
          >
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <SaveBar
        state={save.state}
        dirty={dirty}
        canEdit
        error={save.error}
        label={isNew ? "Create job" : "Save job"}
      />
    </form>
  );
}

export function JobsManager({
  jobs,
  canEdit,
  canManage,
  canDelete,
}: {
  jobs: JobRecord[];
  canEdit: boolean;
  canManage: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<JobRecord | null>(null);
  const [, start] = useTransition();

  return (
    <div>
      {canEdit && !editing && (
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setEditing(blankJob())}
          >
            + New job
          </button>
        </div>
      )}

      {editing && (
        <JobEditor
          key={editing.id || "new"}
          initial={editing}
          onDone={() => setEditing(null)}
        />
      )}

      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>Title</th>
              <th>Sector</th>
              <th>Level</th>
              <th>State</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>
                  <div className="font-medium text-strong">{j.title}</div>
                  <div className="text-[0.7rem] text-muted">{j.location}</div>
                </td>
                <td>{j.sector}</td>
                <td>{j.experienceLevel}</td>
                <td>
                  {canManage ? (
                    <select
                      className="select h-7 w-auto py-0.5 text-xs"
                      value={j.state}
                      aria-label={`State for ${j.title}`}
                      onChange={(e) =>
                        start(async () => {
                          await setJobState(j.id, e.target.value as JobState);
                          router.refresh();
                        })
                      }
                    >
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={statusBadgeClass(j.state)}>
                      {titleCase(j.state)}
                    </span>
                  )}
                </td>
                <td className="text-end">
                  {canEdit && (
                    <button
                      type="button"
                      className="btn btn-ghost px-2 py-1 text-xs"
                      onClick={() => setEditing(j)}
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      className="btn btn-ghost px-2 py-1 text-xs text-error"
                      onClick={() =>
                        start(async () => {
                          await deleteJob(j.id);
                          router.refresh();
                        })
                      }
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
