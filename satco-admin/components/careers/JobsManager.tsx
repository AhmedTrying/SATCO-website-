"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type {
  JobApplication,
  JobRecord,
  JobState,
  ScreeningQuestion,
  SectorSlug,
} from "@satco/shared";
import { isJobDeadlineOpen } from "@satco/shared";

import { deleteJob, saveJob, setJobState } from "@/app/actions/jobs";
import { StringList } from "@/components/form/StringList";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";
import { useSave } from "@/lib/use-save";

const SECTORS: SectorSlug[] = ["airports", "construction", "operations", "ppp"];
const LEVELS = ["entry", "mid", "senior", "lead", "executive"] as const;
const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "temporary",
  "internship",
] as const;
const STATES: JobState[] = ["draft", "published", "paused", "closed", "archived"];

function blankJob(): JobRecord {
  return {
    id: "",
    slug: "",
    jobReference: "",
    title: "",
    department: "",
    location: "",
    sector: "construction",
    discipline: "",
    experienceLevel: "mid",
    type: "full-time",
    numberOfVacancies: 1,
    experienceRequired: "",
    education: "",
    summary: "",
    responsibilities: [""],
    requirements: [""],
    preferredQualifications: [],
    applicationDeadline: "",
    hiringManager: "",
    screeningQuestions: [],
    applyHref: "https://careers.satco.com.sa/apply",
    source: "dashboard",
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

function dateValue(value?: string): string {
  return value ? value.slice(0, 10) : "";
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="hint">{hint}</p>}
    </div>
  );
}

function QuestionEditor({
  questions,
  onChange,
}: {
  questions: ScreeningQuestion[];
  onChange: (questions: ScreeningQuestion[]) => void;
}) {
  function update(index: number, patch: Partial<ScreeningQuestion>) {
    onChange(questions.map((question, i) => (i === index ? { ...question, ...patch } : question)));
  }

  return (
    <section className="border-t border-border pt-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-strong">Screening questions</h3>
          <p className="mt-1 text-xs text-muted">
            Mark each question as required or preferred. Applicants are grouped for review,
            never automatically accepted or rejected.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary text-xs"
          onClick={() =>
            onChange([
              ...questions,
              {
                id: `screen-${Date.now()}`,
                question: "",
                criteria: "required",
                responseType: "yes-no",
              },
            ])
          }
        >
          + Add question
        </button>
      </div>

      {questions.length > 0 && (
        <div className="mt-4 space-y-3">
          {questions.map((question, index) => (
            <div key={question.id} className="rounded-md border border-border bg-stone-50 p-3">
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_130px_130px_auto]">
                <Field label={`Question ${index + 1}`}>
                  <input
                    className="input"
                    value={question.question}
                    onChange={(event) => update(index, { question: event.target.value })}
                    aria-label={`Screening question ${index + 1}`}
                  />
                </Field>
                <Field label="Criteria">
                  <select
                    className="select"
                    value={question.criteria}
                    onChange={(event) =>
                      update(index, {
                        criteria: event.target.value as ScreeningQuestion["criteria"],
                      })
                    }
                  >
                    <option value="required">Required</option>
                    <option value="preferred">Preferred</option>
                  </select>
                </Field>
                <Field label="Answer type">
                  <select
                    className="select"
                    value={question.responseType}
                    onChange={(event) =>
                      update(index, {
                        responseType: event.target.value as ScreeningQuestion["responseType"],
                      })
                    }
                  >
                    <option value="yes-no">Yes / No</option>
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                </Field>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="btn btn-ghost px-2 text-xs text-error"
                    onClick={() => onChange(questions.filter((_, i) => i !== index))}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="mt-3 max-w-sm">
                <Field label="Expected answer (optional)">
                  <input
                    className="input"
                    value={question.expectedAnswer ?? ""}
                    placeholder={question.responseType === "yes-no" ? "Yes" : "Describe the expectation"}
                    onChange={(event) => update(index, { expectedAnswer: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function JobEditor({
  initial,
  onDone,
}: {
  initial: JobRecord;
  onDone: () => void;
}) {
  const router = useRouter();
  const [job, setJob] = useState<JobRecord>({
    ...initial,
    applicationDeadline: dateValue(initial.applicationDeadline),
    preferredQualifications: initial.preferredQualifications ?? [],
    screeningQuestions: initial.screeningQuestions ?? [],
  });
  const [dirty, setDirty] = useState(initial.id === "");
  const save = useSave();
  const isNew = initial.id === "";

  function set<K extends keyof JobRecord>(key: K, value: JobRecord[K]) {
    setJob((current) => ({ ...current, [key]: value }));
    setDirty(true);
    save.markDirty();
  }

  function submit(state: JobState) {
    const payload: JobRecord = {
      ...job,
      state,
      slug: job.slug || slugify(job.title),
      department: job.department || job.discipline,
      discipline: job.discipline || job.department || "General",
      applicationDeadline: job.applicationDeadline || undefined,
      preferredQualifications: (job.preferredQualifications ?? []).filter(Boolean),
      screeningQuestions: (job.screeningQuestions ?? []).filter((question) => question.question.trim()),
      responsibilities: job.responsibilities.filter(Boolean),
      requirements: job.requirements.filter(Boolean),
    };
    save.run(async () => {
      const result = await saveJob(payload);
      if (result.ok) {
        router.refresh();
        onDone();
      }
      return result;
    });
  }

  const previewHref = `/careers/${job.slug || slugify(job.title)}`;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close job editor"
        className="absolute inset-0 bg-ink/40"
        onClick={onDone}
      />
      <form
        className="absolute inset-y-0 end-0 flex w-full max-w-3xl flex-col bg-surface shadow-lg"
        onSubmit={(event) => {
          event.preventDefault();
          submit(job.state === "published" ? "published" : "draft");
        }}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Recruitment</p>
            <h2 className="mt-0.5 text-lg font-semibold text-strong">
              {isNew ? "Create job" : "Edit job"}
            </h2>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onDone}>
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="space-y-7">
            <section>
              <h3 className="mb-4 text-sm font-semibold text-strong">Role details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Job reference">
                  <input
                    className="input"
                    value={job.jobReference ?? ""}
                    placeholder="e.g. SAT-HR-026"
                    onChange={(event) => set("jobReference", event.target.value)}
                  />
                </Field>
                <Field label="Job title">
                  <input
                    className="input"
                    required
                    value={job.title}
                    onChange={(event) => set("title", event.target.value)}
                  />
                </Field>
                <Field label="Department">
                  <input
                    className="input"
                    value={job.department ?? job.discipline}
                    onChange={(event) => {
                      set("department", event.target.value);
                      set("discipline", event.target.value);
                    }}
                  />
                </Field>
                <Field label="Location">
                  <input
                    className="input"
                    required
                    value={job.location}
                    onChange={(event) => set("location", event.target.value)}
                  />
                </Field>
                <Field label="Employment type">
                  <select
                    className="select"
                    value={job.type ?? "full-time"}
                    onChange={(event) => set("type", event.target.value as JobRecord["type"])}
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {titleCase(type)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Number of vacancies">
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={job.numberOfVacancies ?? 1}
                    onChange={(event) => set("numberOfVacancies", Math.max(1, Number(event.target.value)))}
                  />
                </Field>
                <Field label="Operating sector">
                  <select
                    className="select"
                    value={job.sector}
                    onChange={(event) => set("sector", event.target.value as SectorSlug)}
                  >
                    {SECTORS.map((sector) => (
                      <option key={sector} value={sector}>
                        {titleCase(sector)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Experience level">
                  <select
                    className="select"
                    value={job.experienceLevel}
                    onChange={(event) =>
                      set("experienceLevel", event.target.value as JobRecord["experienceLevel"])
                    }
                  >
                    {LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {titleCase(level)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Experience required">
                  <input
                    className="input"
                    value={job.experienceRequired ?? ""}
                    placeholder="e.g. 5+ years"
                    onChange={(event) => set("experienceRequired", event.target.value)}
                  />
                </Field>
                <Field label="Education">
                  <input
                    className="input"
                    value={job.education ?? ""}
                    placeholder="e.g. Bachelor's degree in Engineering"
                    onChange={(event) => set("education", event.target.value)}
                  />
                </Field>
                <Field label="Application deadline">
                  <input
                    className="input"
                    type="date"
                    value={dateValue(job.applicationDeadline)}
                    onChange={(event) => set("applicationDeadline", event.target.value)}
                  />
                </Field>
                <Field label="Hiring manager">
                  <input
                    className="input"
                    value={job.hiringManager ?? ""}
                    onChange={(event) => set("hiringManager", event.target.value)}
                  />
                </Field>
              </div>
            </section>

            <section className="border-t border-border pt-5">
              <h3 className="mb-4 text-sm font-semibold text-strong">Job description</h3>
              <div className="space-y-4">
                <Field label="Job summary">
                  <textarea
                    className="textarea"
                    rows={4}
                    required
                    value={job.summary}
                    onChange={(event) => set("summary", event.target.value)}
                  />
                </Field>
                <StringList
                  label="Responsibilities"
                  values={job.responsibilities}
                  onChange={(value) => set("responsibilities", value)}
                  multiline
                  addLabel="Add responsibility"
                />
                <StringList
                  label="Requirements"
                  values={job.requirements}
                  onChange={(value) => set("requirements", value)}
                  multiline
                  addLabel="Add requirement"
                />
                <StringList
                  label="Preferred qualifications"
                  values={job.preferredQualifications ?? []}
                  onChange={(value) => set("preferredQualifications", value)}
                  multiline
                  addLabel="Add preferred qualification"
                />
              </div>
            </section>

            <QuestionEditor
              questions={job.screeningQuestions ?? []}
              onChange={(questions) => set("screeningQuestions", questions)}
            />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-stone-50 px-5 py-4 sm:px-7">
          <div className="text-xs text-muted">
            {save.error ? <span className="text-error">{save.error}</span> : dirty ? "Unsaved changes" : "Saved"}
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={previewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              Preview
            </a>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={save.state === "saving"}
              onClick={() => submit("draft")}
            >
              Save draft
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={save.state === "saving"}
              onClick={() => submit("published")}
            >
              {save.state === "saving" ? "Saving…" : "Publish"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

export function JobsManager({
  jobs,
  applications,
  canEdit,
  canManage,
  canDelete,
}: {
  jobs: JobRecord[];
  applications: JobApplication[];
  canEdit: boolean;
  canManage: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<JobRecord | null>(null);
  const [, start] = useTransition();
  const applicationCounts = useMemo(
    () =>
      applications.reduce<Record<string, number>>((counts, application) => {
        counts[application.jobId] = (counts[application.jobId] ?? 0) + 1;
        return counts;
      }, {}),
    [applications],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">Create and maintain vacancies that appear on the public careers site.</p>
        {canEdit && (
          <button type="button" className="btn btn-primary" onClick={() => setEditing(blankJob())}>
            + Create job
          </button>
        )}
      </div>

      <div className="card overflow-x-auto">
        <table className="tbl min-w-[900px]">
          <thead>
            <tr>
              <th>Job reference</th>
              <th>Job title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Applicants</th>
              <th>Published</th>
              <th>Closing date</th>
              <th>Status</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="whitespace-nowrap text-muted">{job.jobReference || "—"}</td>
                <td>
                  <div className="font-medium text-strong">
                    {job.title}
                    {job.state === "published" && !isJobDeadlineOpen(job.applicationDeadline) && (
                      <span className="ms-2 rounded bg-stone-200 px-1.5 py-0.5 text-[0.65rem] font-semibold text-stone-700">
                        Expired
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[0.7rem] text-muted">{titleCase(job.type ?? "full-time")} · {titleCase(job.experienceLevel)}</div>
                </td>
                <td>{job.department || job.discipline}</td>
                <td>{job.location}</td>
                <td>
                  <a href={`/careers?tab=applications&job=${encodeURIComponent(job.id)}`} className="font-medium text-primary hover:underline">
                    {applicationCounts[job.id] ?? 0}
                  </a>
                </td>
                <td className="whitespace-nowrap">{job.postedAt ? formatDate(job.postedAt) : "—"}</td>
                <td className="whitespace-nowrap">{job.applicationDeadline ? formatDate(job.applicationDeadline) : "—"}</td>
                <td>
                  {canManage ? (
                    <select
                      className="select h-8 w-auto py-1 text-xs"
                      value={job.state}
                      aria-label={`Status for ${job.title}`}
                      onChange={(event) =>
                        start(async () => {
                          await setJobState(job.id, event.target.value as JobState);
                          router.refresh();
                        })
                      }
                    >
                      {STATES.map((state) => (
                        <option key={state} value={state}>
                          {titleCase(state)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={statusBadgeClass(job.state)}>{titleCase(job.state)}</span>
                  )}
                </td>
                <td className="text-end">
                  {canEdit && (
                    <button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => setEditing(job)}>
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      className="btn btn-ghost px-2 py-1 text-xs text-error"
                      onClick={() => {
                        if (!window.confirm(`Archive/delete ${job.title}? This cannot be undone.`)) return;
                        start(async () => {
                          await deleteJob(job.id);
                          router.refresh();
                        });
                      }}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-muted">No jobs yet. Create the first vacancy to begin recruiting.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && <JobEditor key={editing.id || "new"} initial={editing} onDone={() => setEditing(null)} />}
    </div>
  );
}
