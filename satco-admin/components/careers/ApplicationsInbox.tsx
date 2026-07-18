"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import type {
  ApplicationStatus,
  GeneralApplication,
  GeneralApplicationStatus,
  JobApplication,
} from "@satco/shared";

import {
  setApplicationStatus,
  setGeneralApplicationStatus,
} from "@/app/actions/applications";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";

const APP_STATUSES: ApplicationStatus[] = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
];
const GEN_STATUSES: GeneralApplicationStatus[] = ["new", "reviewing", "archived"];

function CvCell({ mediaId, canDownload }: { mediaId?: string; canDownload: boolean }) {
  const [msg, setMsg] = useState<string>();
  if (!mediaId) return <span className="text-muted">—</span>;
  if (!canDownload) return <span className="text-muted">🔒</span>;
  return (
    <button
      type="button"
      className="btn btn-ghost px-2 py-0.5 text-xs"
      onClick={() =>
        // TODO(supabase): fetch a short-lived signed URL for the private bucket.
        setMsg("Signed-URL download lands with Supabase Storage.")
      }
    >
      {msg ? "…" : "Download CV"}
    </button>
  );
}

export function ApplicationsInbox({
  applications,
  canManage,
  canDownloadCv,
}: {
  applications: JobApplication[];
  canManage: boolean;
  canDownloadCv: boolean;
}) {
  const router = useRouter();
  const [, start] = useTransition();

  if (applications.length === 0) {
    return <div className="card p-6 text-center text-sm text-muted">No applications.</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Role</th>
            <th>Received</th>
            <th>Status</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>
                <div className="font-medium text-strong">{a.applicantName}</div>
                <div className="text-[0.7rem] text-muted">{a.email}</div>
                {a.coverNote && (
                  <div className="mt-1 max-w-xs text-[0.7rem] text-muted">
                    {a.coverNote}
                  </div>
                )}
              </td>
              <td>{a.jobTitle}</td>
              <td className="whitespace-nowrap">{formatDate(a.createdAt)}</td>
              <td>
                {canManage ? (
                  <select
                    className="select h-7 w-auto py-0.5 text-xs"
                    value={a.status}
                    aria-label={`Status for ${a.applicantName}`}
                    onChange={(e) =>
                      start(async () => {
                        await setApplicationStatus(
                          a.id,
                          e.target.value as ApplicationStatus,
                        );
                        router.refresh();
                      })
                    }
                  >
                    {APP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={statusBadgeClass(a.status)}>
                    {titleCase(a.status)}
                  </span>
                )}
              </td>
              <td>
                <CvCell mediaId={a.cvMediaId} canDownload={canDownloadCv} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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

  if (applications.length === 0) {
    return (
      <div className="card p-6 text-center text-sm text-muted">
        No general applications.
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="tbl">
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Discipline</th>
            <th>Received</th>
            <th>Status</th>
            <th>CV</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => (
            <tr key={a.id}>
              <td>
                <div className="font-medium text-strong">{a.applicantName}</div>
                <div className="text-[0.7rem] text-muted">{a.email}</div>
                {a.note && (
                  <div className="mt-1 max-w-xs text-[0.7rem] text-muted">{a.note}</div>
                )}
              </td>
              <td>
                {a.discipline ?? "—"}
                {a.sector && (
                  <div className="text-[0.7rem] text-muted">{a.sector}</div>
                )}
              </td>
              <td className="whitespace-nowrap">{formatDate(a.createdAt)}</td>
              <td>
                {canManage ? (
                  <select
                    className="select h-7 w-auto py-0.5 text-xs"
                    value={a.status}
                    aria-label={`Status for ${a.applicantName}`}
                    onChange={(e) =>
                      start(async () => {
                        await setGeneralApplicationStatus(
                          a.id,
                          e.target.value as GeneralApplicationStatus,
                        );
                        router.refresh();
                      })
                    }
                  >
                    {GEN_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className={statusBadgeClass(a.status)}>
                    {titleCase(a.status)}
                  </span>
                )}
              </td>
              <td>
                <CvCell mediaId={a.cvMediaId} canDownload={canDownloadCv} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
