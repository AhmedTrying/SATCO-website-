"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type { ContactSubmission, InquiryType, SubmissionStatus } from "@satco/shared";

import { updateSubmission } from "@/app/actions/submissions";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";
import { INQUIRY_LABELS } from "@/lib/routing";

const STATUSES: SubmissionStatus[] = ["new", "in-progress", "responded", "closed"];
const INQUIRIES: InquiryType[] = [
  "partnerships",
  "opportunities",
  "procurement",
  "careers",
  "general",
];

function InquiryDrawer({
  submission,
  staff,
  onClose,
}: {
  submission: ContactSubmission;
  staff: string[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [note, setNote] = useState(submission.internalNote ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();

  function update(patch: Partial<Pick<ContactSubmission, "status" | "assignee" | "internalNote">>) {
    start(async () => {
      setSaving(true);
      const result = await updateSubmission(submission.id, patch);
      setSaving(false);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError(undefined);
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close inquiry" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <aside className="absolute inset-y-0 end-0 flex w-full max-w-xl flex-col bg-surface shadow-lg">
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Inquiry</p>
            <h2 className="mt-0.5 text-xl font-semibold text-strong">{submission.name}</h2>
            <p className="mt-1 text-sm text-muted">{INQUIRY_LABELS[submission.inquiryType]}</p>
          </div>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
          <section className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div><p className="text-xs font-medium text-muted">Email</p><a className="mt-1 inline-block text-sm text-primary hover:underline" href={`mailto:${submission.email}`}>{submission.email}</a></div>
            <div><p className="text-xs font-medium text-muted">Received</p><p className="mt-1 text-sm text-strong">{formatDate(submission.createdAt)}</p></div>
            {submission.organization && <div><p className="text-xs font-medium text-muted">Organization</p><p className="mt-1 text-sm text-strong">{submission.organization}</p></div>}
            <div><p className="text-xs font-medium text-muted">Routed to</p><p className="mt-1 text-sm text-strong">{submission.assignedDept}</p></div>
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Message</h3>
            <div className="mt-3 whitespace-pre-wrap rounded-md bg-stone-50 p-4 text-sm leading-relaxed text-body">{submission.message}</div>
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Handling</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div><label className="label">Status</label><select className="select" value={submission.status} onChange={(event) => update({ status: event.target.value as SubmissionStatus })}>{STATUSES.map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}</select></div>
              <div><label className="label">Assignee</label><select className="select" value={submission.assignee ?? ""} onChange={(event) => update({ assignee: event.target.value })}><option value="">Unassigned</option>{staff.map((email) => <option key={email} value={email}>{email}</option>)}</select></div>
            </div>
          </section>

          <section className="mt-7 border-t border-border pt-5">
            <h3 className="text-sm font-semibold text-strong">Internal note</h3>
            <p className="mt-1 text-xs text-muted">Visible only to dashboard users.</p>
            <textarea className="textarea mt-3" rows={5} value={note} onChange={(event) => setNote(event.target.value)} />
            {error && <p className="field-error">{error}</p>}
            <button type="button" className="btn btn-secondary mt-2" disabled={saving} onClick={() => update({ internalNote: note })}>{saving ? "Saving…" : "Save note"}</button>
          </section>
        </div>
      </aside>
    </div>
  );
}

export function SubmissionsInbox({
  submissions,
  staff,
}: {
  submissions: ContactSubmission[];
  staff: string[];
}) {
  const [query, setQuery] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<ContactSubmission>();

  const filtered = useMemo(
    () => submissions.filter((submission) => {
      if (inquiry && submission.inquiryType !== inquiry) return false;
      if (status && submission.status !== status) return false;
      const haystack = `${submission.name} ${submission.email} ${submission.organization ?? ""} ${submission.message}`.toLowerCase();
      return !query || haystack.includes(query.trim().toLowerCase());
    }),
    [inquiry, query, status, submissions],
  );

  const hasFilters = Boolean(query || inquiry || status);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3 border-b border-border pb-4">
        <div className="min-w-[240px]"><label className="label text-xs">Search</label><input className="input h-9 py-1 text-sm" value={query} placeholder="Name, email, message…" onChange={(event) => setQuery(event.target.value)} /></div>
        <div><label className="label text-xs">Inquiry type</label><select className="select h-9 w-auto py-1 text-sm" value={inquiry} onChange={(event) => setInquiry(event.target.value)}><option value="">All types</option>{INQUIRIES.map((item) => <option key={item} value={item}>{INQUIRY_LABELS[item]}</option>)}</select></div>
        <div><label className="label text-xs">Status</label><select className="select h-9 w-auto py-1 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{STATUSES.map((item) => <option key={item} value={item}>{titleCase(item)}</option>)}</select></div>
        {hasFilters && <button type="button" className="btn btn-ghost text-xs" onClick={() => { setQuery(""); setInquiry(""); setStatus(""); }}>Clear filters</button>}
      </div>
      <p className="mb-3 text-xs text-muted">{filtered.length} inquir{filtered.length === 1 ? "y" : "ies"}</p>
      <div className="card overflow-x-auto">
        <table className="tbl min-w-[760px]">
          <thead><tr><th>From</th><th>Inquiry</th><th>Received</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
          <tbody>
            {filtered.map((submission) => (
              <tr key={submission.id}>
                <td><button type="button" className="text-start font-medium text-strong hover:text-primary" onClick={() => setSelected(submission)}>{submission.name}<span className="mt-0.5 block text-[0.7rem] font-normal text-muted">{submission.email}</span></button>{submission.organization && <span className="mt-0.5 block text-[0.7rem] text-muted">{submission.organization}</span>}</td>
                <td><div className="font-medium text-strong">{INQUIRY_LABELS[submission.inquiryType]}</div><div className="mt-0.5 max-w-sm truncate text-[0.7rem] text-muted">{submission.message}</div></td>
                <td className="whitespace-nowrap">{formatDate(submission.createdAt)}</td>
                <td><span className={statusBadgeClass(submission.status)}>{titleCase(submission.status)}</span></td>
                <td className="text-end"><button type="button" className="btn btn-ghost px-2 py-1 text-xs" onClick={() => setSelected(submission)}>Open</button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="py-10 text-center text-muted">No inquiries match these filters.</td></tr>}
          </tbody>
        </table>
      </div>
      {selected && <InquiryDrawer submission={selected} staff={staff} onClose={() => setSelected(undefined)} />}
    </div>
  );
}
