"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type {
  ApplicationStatus,
  GeneralApplication,
  GeneralApplicationStatus,
  JobApplication,
} from "@satco/shared";

import {
  addApplicationNote,
  setApplicationStatus,
  setGeneralApplicationStatus,
} from "@/app/actions/applications";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";

const APP_STATUSES: ApplicationStatus[] = [
  "new",
  "under-review",
  "shortlisted",
  "interview",
  "final-review",
  "offer",
  "hired",
  "rejected",
  "withdrawn",
  "talent-pool",
];
const GEN_STATUSES: GeneralApplicationStatus[] = ["new", "reviewing", "archived"];

function candidateKey(application: JobApplication): string {
  return application.candidateId ?? application.email.trim().toLowerCase();
}

function CvCell({ mediaId, canDownload }: { mediaId?: string; canDownload: boolean }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!mediaId) return <span className="text-muted">—</span>;
  if (!canDownload) return <span className="text-muted">Restricted</span>;

  async function downloadCv() {
    setIsDownloading(true);
    setError(null);

    try {
      const response = await fetch(`/api/private/media/${mediaId}`);
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(body?.error ?? "The CV could not be downloaded. Please try again.");
        return;
      }

      const file = await response.blob();
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition?.match(/filename\*?=(?:UTF-8''|\")?([^;\"]+)/i)?.[1];

      link.href = url;
      link.download = filename ? decodeURIComponent(filename) : "candidate-cv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("The CV could not be downloaded. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="min-w-[138px]">
      <button
        type="button"
        className="btn btn-ghost px-2 py-0.5 text-xs"
        onClick={downloadCv}
        disabled={isDownloading}
      >
        {isDownloading ? "Downloading…" : "View CV"}
      </button>
      {error ? (
        <p role="alert" className="mt-1 text-xs leading-4 text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-[150px]">
      <label className="label text-xs">{label}</label>
      {children}
    </div>
  );
}

function matchesYears(value: number | undefined, range: string): boolean {
  if (!range) return true;
  if (value === undefined) return false;
  if (range === "0-2") return value <= 2;
  if (range === "3-5") return value >= 3 && value <= 5;
  if (range === "6-10") return value >= 6 && value <= 10;
  return value >= 11;
}

function CandidateProfile({
  application,
  applications,
  canManage,
  canDownloadCv,
  onClose,
}: {
  application: JobApplication;
  applications: JobApplication[];
  canManage: boolean;
  canDownloadCv: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string>();
  const [copied, setCopied] = useState(false);
  const sameCandidate = useMemo(
    () => applications.filter((item) => candidateKey(item) === candidateKey(application)),
    [application, applications],
  );

  function changeStatus(status: ApplicationStatus) {
    start(async () => {
      await setApplicationStatus(application.id, status);
      router.refresh();
    });
  }

  function saveNote() {
    start(async () => {
      const result = await addApplicationNote(application.id, note);
      if (!result.ok) {
        setNoteError(result.error);
        return;
      }
      setNote("");
      setNoteError(undefined);
      router.refresh();
    });
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(application.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const facts = [
    ["Current role", application.currentJobTitle],
    ["Location", [application.currentCity, application.countryOfResidence].filter(Boolean).join(", ")],
    ["Experience", application.yearsExperience !== undefined ? `${application.yearsExperience} years` : undefined],
    ["Qualification", application.qualification],
    ["Specialization", application.specialization],
    ["Notice period", application.noticePeriod],
    ["Work authorization", application.workAuthorization],
    ["Source", application.applicationSource],
  ].filter(([, value]) => Boolean(value));
  const coverLetterParagraphs = application.coverNote
    ?.split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close candidate profile" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-2xl flex-col bg-surface shadow-lg">
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Candidate profile</p>
            <h2 className="mt-0.5 text-xl font-semibold text-strong">{application.applicantName}</h2>
            <p className="mt-1 text-sm text-muted">Applied for {application.jobTitle}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div>
              <p className="text-sm text-strong">{application.email}</p>
              {application.phone && <p className="mt-1 text-sm text-muted">{application.phone}</p>}
              {application.linkedinUrl && (
                <a className="mt-2 inline-block text-sm text-primary hover:underline" href={application.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  LinkedIn profile
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={statusBadgeClass(application.status)}>{titleCase(application.status)}</span>
              {application.criteriaMatch && <span className={statusBadgeClass(application.criteriaMatch === "missing-required" ? "rejected" : application.criteriaMatch === "meets-required" ? "hired" : "under-review")}>{titleCase(application.criteriaMatch)}</span>}
            </div>
          </div>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Application</h3>
            <div className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium text-muted">{label}</p>
                  <p className="mt-0.5 text-sm text-strong">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-medium text-muted">Applied</p>
                <p className="mt-0.5 text-sm text-strong">{formatDate(application.createdAt)}</p>
              </div>
              {application.skills?.length ? (
                <div className="sm:col-span-2">
                  <p className="text-xs font-medium text-muted">Skills</p>
                  <p className="mt-1 text-sm text-strong">{application.skills.join(", ")}</p>
                </div>
              ) : null}
            </div>
            {coverLetterParagraphs?.length ? (
              <div className="mt-4 rounded-md bg-stone-50 p-3 text-sm leading-relaxed text-body">
                <p className="mb-1 text-xs font-medium text-muted">Cover letter</p>
                <div className="mt-2 space-y-3">
                  {coverLetterParagraphs.map((paragraph, index) => (
                    <p key={`${index}-${paragraph.slice(0, 24)}`} className="m-0 whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mt-4"><CvCell mediaId={application.cvMediaId} canDownload={canDownloadCv} /></div>
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Screening answers</h3>
            {application.screeningAnswers?.length ? (
              <div className="mt-3 space-y-3">
                {application.screeningAnswers.map((answer) => (
                  <div key={answer.questionId} className="rounded-md border border-border p-3">
                    <div className="flex justify-between gap-3">
                      <p className="text-sm font-medium text-strong">{answer.question}</p>
                      <span className="badge badge-stone">{titleCase(answer.criteria)}</span>
                    </div>
                    <p className="mt-2 text-sm text-body">{answer.answer || "No response"}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">No job-specific screening questions were recorded for this application.</p>
            )}
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Other applications</h3>
            <div className="mt-3 space-y-2">
              {sameCandidate.map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <span className="font-medium text-strong">{item.jobTitle}</span>
                  <span className={statusBadgeClass(item.status)}>{titleCase(item.status)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Internal HR notes</h3>
            {application.internalNotes?.length ? (
              <div className="mt-3 space-y-3">
                {application.internalNotes.map((item) => (
                  <div key={item.id} className="rounded-md bg-stone-50 p-3">
                    <p className="text-sm text-body">{item.body}</p>
                    <p className="mt-2 text-xs text-muted">{item.author} · {formatDate(item.createdAt)}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {canManage && (
              <div className="mt-3">
                <label className="label">Add note</label>
                <textarea className="textarea" rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
                {noteError && <p className="field-error">{noteError}</p>}
                <button type="button" className="btn btn-secondary mt-2" onClick={saveNote}>Add note</button>
              </div>
            )}
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Recruitment timeline</h3>
            <ol className="mt-3 space-y-3 border-s border-stone-300 ps-4">
              {(application.history?.length ? application.history : [{ id: "created", label: "Application received", createdAt: application.createdAt }]).map((event) => (
                <li key={event.id} className="relative text-sm">
                  <span aria-hidden="true" className="absolute -start-[21px] top-1.5 h-2 w-2 rounded-full bg-bronze-600" />
                  <p className="font-medium text-strong">{event.label}</p>
                  {event.detail && <p className="text-muted">{titleCase(event.detail)}</p>}
                  <p className="mt-0.5 text-xs text-muted">{formatDate(event.createdAt)}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {canManage && (
          <footer className="border-t border-border bg-stone-50 px-5 py-4 sm:px-7">
            <div className="flex flex-wrap gap-2">
              <select className="select h-9 w-auto py-1 text-sm" value={application.status} onChange={(event) => changeStatus(event.target.value as ApplicationStatus)} aria-label="Move recruitment stage">
                {APP_STATUSES.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
              </select>
              <a
                className="btn btn-secondary"
                href={`mailto:${application.email}?subject=${encodeURIComponent(`SATCO interview — ${application.jobTitle}`)}`}
              >
                Schedule interview
              </a>
              <button type="button" className="btn btn-secondary" onClick={copyEmail}>{copied ? "Email copied" : "Contact candidate"}</button>
              <button type="button" className="btn btn-ghost text-error" onClick={() => changeStatus("rejected")}>Reject</button>
              <button type="button" className="btn btn-ghost" onClick={() => changeStatus("talent-pool")}>Add to talent pool</button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
}

export function ApplicationsInbox({
  applications,
  canManage,
  canDownloadCv,
  initialJobId,
}: {
  applications: JobApplication[];
  canManage: boolean;
  canDownloadCv: boolean;
  initialJobId?: string;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [years, setYears] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [authorization, setAuthorization] = useState("");
  const [skills, setSkills] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [source, setSource] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const selected = applications.find((application) => application.id === selectedId);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return applications.filter((application) => {
      const haystack = [
        application.applicantName,
        application.email,
        application.phone,
        application.currentJobTitle,
        application.currentCity,
        application.countryOfResidence,
        application.qualification,
        application.specialization,
        application.currentEmployer,
        application.skills?.join(" "),
        application.screeningAnswers?.map((answer) => `${answer.question} ${answer.answer}`).join(" "),
      ].join(" ").toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (initialJobId && application.jobId !== initialJobId) return false;
      if (status && application.status !== status) return false;
      if (!matchesYears(application.yearsExperience, years)) return false;
      if (location && !`${application.currentCity ?? ""} ${application.countryOfResidence ?? ""}`.toLowerCase().includes(location.toLowerCase())) return false;
      if (education && !`${application.qualification ?? ""}`.toLowerCase().includes(education.toLowerCase())) return false;
      if (specialization && !`${application.specialization ?? ""}`.toLowerCase().includes(specialization.toLowerCase())) return false;
      if (noticePeriod && !(application.noticePeriod ?? "").toLowerCase().includes(noticePeriod.toLowerCase())) return false;
      if (authorization && !(application.workAuthorization ?? "").toLowerCase().includes(authorization.toLowerCase())) return false;
      if (skills && !(application.skills ?? []).join(" ").toLowerCase().includes(skills.toLowerCase())) return false;
      if (source && !(application.applicationSource ?? "").toLowerCase().includes(source.toLowerCase())) return false;
      const created = application.createdAt.slice(0, 10);
      if (fromDate && created < fromDate) return false;
      if (toDate && created > toDate) return false;
      return true;
    });
  }, [applications, authorization, education, fromDate, initialJobId, location, noticePeriod, query, skills, source, specialization, status, toDate, years]);

  function clearFilters() {
    setQuery(""); setStatus(""); setYears(""); setLocation(""); setEducation("");
    setSpecialization(""); setNoticePeriod(""); setAuthorization(""); setSkills("");
    setFromDate(""); setToDate(""); setSource("");
  }

  const hasFilters = Boolean(query || status || years || location || education || specialization || noticePeriod || authorization || skills || fromDate || toDate || source || initialJobId);

  return (
    <div>
      <div className="mb-4 border-b border-border pb-4">
        <div className="flex flex-wrap items-end gap-3">
          <FilterField label="Search candidates">
            <input className="input h-9 min-w-[240px] py-1 text-sm" value={query} placeholder="Name, email, skills…" onChange={(event) => setQuery(event.target.value)} />
          </FilterField>
          <FilterField label="Application status">
            <select className="select h-9 w-auto py-1 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="">All statuses</option>
              {APP_STATUSES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}
            </select>
          </FilterField>
          <FilterField label="Years of experience">
            <select className="select h-9 w-auto py-1 text-sm" value={years} onChange={(event) => setYears(event.target.value)}>
              <option value="">Any experience</option><option value="0-2">0–2 years</option><option value="3-5">3–5 years</option><option value="6-10">6–10 years</option><option value="11+">11+ years</option>
            </select>
          </FilterField>
          <button type="button" className="btn btn-ghost text-xs" onClick={() => setShowMore((visible) => !visible)}>{showMore ? "Fewer filters" : "More filters"}</button>
          {hasFilters && <button type="button" className="btn btn-ghost text-xs" onClick={clearFilters}>Clear filters</button>}
        </div>
        {showMore && (
          <>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterField label="Location"><input className="input h-9 py-1 text-sm" value={location} onChange={(event) => setLocation(event.target.value)} /></FilterField>
            <FilterField label="Education"><input className="input h-9 py-1 text-sm" value={education} onChange={(event) => setEducation(event.target.value)} /></FilterField>
            <FilterField label="Specialization"><input className="input h-9 py-1 text-sm" value={specialization} onChange={(event) => setSpecialization(event.target.value)} /></FilterField>
            <FilterField label="Notice period"><input className="input h-9 py-1 text-sm" value={noticePeriod} onChange={(event) => setNoticePeriod(event.target.value)} /></FilterField>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]">
            <FilterField label="Work authorization"><input className="input h-9 py-1 text-sm" value={authorization} onChange={(event) => setAuthorization(event.target.value)} /></FilterField>
            <FilterField label="Skills / keywords"><input className="input h-9 py-1 text-sm" value={skills} onChange={(event) => setSkills(event.target.value)} /></FilterField>
            <FilterField label="Application source"><input className="input h-9 py-1 text-sm" value={source} onChange={(event) => setSource(event.target.value)} /></FilterField>
            <div className="grid min-w-0 grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-2 lg:col-span-1">
              <FilterField label="Applied from"><input className="input h-9 py-1 text-sm" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></FilterField>
              <FilterField label="Applied to"><input className="input h-9 py-1 text-sm" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></FilterField>
            </div>
            </div>
          </>
        )}
      </div>

      <p className="mb-3 text-xs text-muted">{filtered.length} applicant{filtered.length === 1 ? "" : "s"}{initialJobId ? " for this vacancy" : ""}</p>
      <div className="card overflow-x-auto">
        <table className="tbl min-w-[1000px]">
          <thead><tr><th>Candidate</th><th>Current job title</th><th>Experience</th><th>Location</th><th>Qualification</th><th>Applied</th><th>Status</th><th>CV</th><th className="text-end">Actions</th></tr></thead>
          <tbody>
            {filtered.map((application) => (
              <tr key={application.id}>
                <td><button type="button" className="text-start font-medium text-strong hover:text-primary" onClick={() => setSelectedId(application.id)}>{application.applicantName}<span className="mt-0.5 block text-[0.7rem] font-normal text-muted">{application.email}</span></button></td>
                <td>{application.currentJobTitle || "—"}<span className="mt-0.5 block text-[0.7rem] text-muted">{application.jobTitle}</span></td>
                <td>{application.yearsExperience !== undefined ? `${application.yearsExperience} years` : "—"}</td>
                <td>{[application.currentCity, application.countryOfResidence].filter(Boolean).join(", ") || "—"}</td>
                <td>{application.qualification || "—"}</td>
                <td className="whitespace-nowrap">{formatDate(application.createdAt)}</td>
                <td>{canManage ? <select className="select h-8 w-auto py-1 text-xs" value={application.status} aria-label={`Status for ${application.applicantName}`} onChange={(event) => start(async () => { await setApplicationStatus(application.id, event.target.value as ApplicationStatus); router.refresh(); })}>{APP_STATUSES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}</select> : <span className={statusBadgeClass(application.status)}>{titleCase(application.status)}</span>}</td>
                <td><CvCell mediaId={application.cvMediaId} canDownload={canDownloadCv} /></td>
                <td className="text-end"><button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => setSelectedId(application.id)}>Open</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={9} className="py-10 text-center text-muted">No applicants match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <CandidateProfile application={selected} applications={applications} canManage={canManage} canDownloadCv={canDownloadCv} onClose={() => setSelectedId(undefined)} />}
    </div>
  );
}

export function GeneralApplicationsInbox({
  applications,
  canManage,
  canDownloadCv,
}: {
  applications: GeneralApplication[];
  canManage: boolean;
  canDownloadCv: boolean;
}) {
  const router = useRouter();
  const [, start] = useTransition();

  return (
    <div className="card overflow-x-auto">
      <table className="tbl">
        <thead><tr><th>Candidate</th><th>Discipline</th><th>Received</th><th>Status</th><th>CV</th></tr></thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td><div className="font-medium text-strong">{application.applicantName}</div><div className="text-[0.7rem] text-muted">{application.email}</div></td>
              <td>{application.discipline ?? "—"}</td>
              <td className="whitespace-nowrap">{formatDate(application.createdAt)}</td>
              <td>{canManage ? <select className="select h-8 w-auto py-1 text-xs" value={application.status} aria-label={`Status for ${application.applicantName}`} onChange={(event) => start(async () => { await setGeneralApplicationStatus(application.id, event.target.value as GeneralApplicationStatus); router.refresh(); })}>{GEN_STATUSES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}</select> : <span className={statusBadgeClass(application.status)}>{titleCase(application.status)}</span>}</td>
              <td><CvCell mediaId={application.cvMediaId} canDownload={canDownloadCv} /></td>
            </tr>
          ))}
          {applications.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted">No general applications.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
