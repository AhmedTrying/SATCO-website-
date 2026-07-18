"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import type {
  ContactSubmission,
  InquiryType,
  SubmissionStatus,
} from "@satco/shared";

import { updateSubmission } from "@/app/actions/submissions";
import { INQUIRY_LABELS } from "@/lib/routing";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";

const STATUSES: SubmissionStatus[] = ["new", "in-progress", "handled", "archived"];
const INQUIRIES: InquiryType[] = [
  "partnerships",
  "opportunities",
  "procurement",
  "careers",
  "general",
];

function toCsv(rows: ContactSubmission[]): string {
  const headers = [
    "id",
    "createdAt",
    "name",
    "email",
    "organization",
    "inquiryType",
    "assignedDept",
    "status",
    "assignee",
    "message",
  ];
  const esc = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    headers.map((h) => esc((r as unknown as Record<string, unknown>)[h])).join(","),
  );
  return [headers.join(","), ...lines].join("\n");
}

export function SubmissionsInbox({
  submissions,
  staff,
}: {
  submissions: ContactSubmission[];
  staff: string[];
}) {
  const router = useRouter();
  const [, start] = useTransition();
  const [inquiry, setInquiry] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      submissions.filter((s) => {
        if (inquiry && s.inquiryType !== inquiry) return false;
        if (status && s.status !== status) return false;
        if (q) {
          const hay = `${s.name} ${s.email} ${s.organization ?? ""} ${s.message}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [submissions, inquiry, status, q],
  );

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "satco-contact-submissions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div>
          <label className="label text-xs">Search</label>
          <input
            className="input h-8 py-1 text-xs"
            value={q}
            placeholder="name, email, message…"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div>
          <label className="label text-xs">Inquiry type</label>
          <select
            className="select h-8 w-auto py-1 text-xs"
            value={inquiry}
            onChange={(e) => setInquiry(e.target.value)}
          >
            <option value="">All</option>
            {INQUIRIES.map((i) => (
              <option key={i} value={i}>
                {INQUIRY_LABELS[i]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label text-xs">Status</label>
          <select
            className="select h-8 w-auto py-1 text-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {titleCase(s)}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn-secondary ms-auto text-xs" onClick={exportCsv}>
          Export CSV ({filtered.length})
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="tbl">
          <thead>
            <tr>
              <th>From</th>
              <th>Inquiry → Dept</th>
              <th>Message</th>
              <th>Status</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>
                  <div className="font-medium text-strong">{s.name}</div>
                  <div className="text-[0.7rem] text-muted">{s.email}</div>
                  {s.organization && (
                    <div className="text-[0.7rem] text-muted">{s.organization}</div>
                  )}
                  <div className="text-[0.7rem] text-muted">
                    {formatDate(s.createdAt)}
                  </div>
                </td>
                <td>
                  <div className="capitalize">{s.inquiryType}</div>
                  <div className="mt-0.5">
                    <span className="badge badge-stone">{s.assignedDept}</span>
                  </div>
                </td>
                <td className="max-w-sm">
                  <div className="text-[0.8rem]">{s.message}</div>
                </td>
                <td>
                  <select
                    className="select h-7 w-auto py-0.5 text-xs"
                    value={s.status}
                    aria-label={`Status for ${s.name}`}
                    onChange={(e) =>
                      start(async () => {
                        await updateSubmission(s.id, {
                          status: e.target.value as SubmissionStatus,
                        });
                        router.refresh();
                      })
                    }
                  >
                    {STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    <span className={statusBadgeClass(s.status)}>
                      {titleCase(s.status)}
                    </span>
                  </div>
                </td>
                <td>
                  <select
                    className="select h-7 w-auto py-0.5 text-xs"
                    value={s.assignee ?? ""}
                    aria-label={`Assignee for ${s.name}`}
                    onChange={(e) =>
                      start(async () => {
                        await updateSubmission(s.id, { assignee: e.target.value });
                        router.refresh();
                      })
                    }
                  >
                    <option value="">Unassigned</option>
                    {staff.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted">
                  No submissions match the filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
