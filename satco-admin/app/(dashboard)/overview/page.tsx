import Link from "next/link";
import { accessibleInboxes, isJobDeadlineOpen } from "@satco/shared";

import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";
import { inboxHref } from "@/lib/nav";
import { INQUIRY_LABELS } from "@/lib/routing";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href: string;
  hint?: string;
}) {
  return (
    <Link href={href} className="card p-4 transition-colors hover:border-bronze-300">
      <div className="text-2xl font-semibold text-strong">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
      {hint && <div className="mt-1 text-[0.7rem] text-muted">{hint}</div>}
    </Link>
  );
}

export default async function OverviewPage() {
  const session = await requireSession();
  const careers = can(session, "manageJobs");
  const inboxes = accessibleInboxes(session);

  const [jobs, applications, submissions] = await Promise.all([
    careers ? adapters.jobs.list() : Promise.resolve([]),
    careers ? adapters.submissions.listApplications() : Promise.resolve([]),
    inboxes.length > 0 ? adapters.submissions.listContact() : Promise.resolve([]),
  ]);

  // Only the inboxes this user may open — never counts for other departments.
  const mine = submissions.filter((s) => inboxes.includes(s.inquiryType));
  const openJobs = jobs.filter(
    (j) => j.state === "published" && isJobDeadlineOpen(j.applicationDeadline),
  ).length;
  const newApps = applications.filter((a) => a.status === "new").length;
  const recent = mine.slice(0, 6);

  return (
    <>
      <PageHeader
        title={`Welcome, ${session.name.split(" ")[0]}`}
        description="What needs attention across careers and your inquiry inboxes."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {careers && <StatCard label="Open roles" value={openJobs} href="/careers" />}
        {careers && (
          <StatCard label="New applications" value={newApps} href="/careers?tab=applications" />
        )}
        {inboxes.map((inbox) => {
          const items = mine.filter((s) => s.inquiryType === inbox);
          const fresh = items.filter((s) => s.status === "new").length;
          return (
            <StatCard
              key={inbox}
              label={INQUIRY_LABELS[inbox]}
              value={fresh}
              hint={`new of ${items.length} inquir${items.length === 1 ? "y" : "ies"}`}
              href={inboxHref(inbox)}
            />
          );
        })}
      </div>

      {!careers && inboxes.length === 0 && (
        <p className="card mt-4 p-6 text-sm text-muted">
          Your account has no pages yet. Ask an admin to grant you Jobs &amp;
          applications or an inquiry inbox under Users &amp; access.
        </p>
      )}

      {inboxes.length > 0 && (
        <section className="card mt-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">Latest inquiries</h2>
            <Link
              href={inboxes.length > 1 ? "/inquiries" : inboxHref(inboxes[0])}
              className="text-xs text-primary hover:underline"
            >
              Open inbox →
            </Link>
          </div>
          <div className="mt-2 overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Inbox</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={inboxHref(s.inquiryType)} className="font-medium text-strong hover:text-primary">
                        {s.name}
                      </Link>
                      <div className="text-[0.7rem] text-muted">{formatDate(s.createdAt)}</div>
                    </td>
                    <td>{INQUIRY_LABELS[s.inquiryType]}</td>
                    <td>
                      <span className={statusBadgeClass(s.status)}>{titleCase(s.status)}</span>
                    </td>
                  </tr>
                ))}
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-muted">
                      No inquiries yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
