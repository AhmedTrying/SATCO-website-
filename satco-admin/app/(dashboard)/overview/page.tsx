import Link from "next/link";

import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireSession } from "@/lib/auth";
import { formatDate, statusBadgeClass, titleCase } from "@/lib/format";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number | string;
  href: string;
}) {
  return (
    <Link href={href} className="card p-4 transition-colors hover:border-bronze-300">
      <div className="text-2xl font-semibold text-strong">{value}</div>
      <div className="mt-0.5 text-xs text-muted">{label}</div>
    </Link>
  );
}

export default async function OverviewPage() {
  const session = await requireSession();
  const [jobs, submissions, applications, media, diff, history] = await Promise.all([
    adapters.jobs.list(),
    adapters.submissions.listContact(),
    adapters.submissions.listApplications(),
    adapters.media.list(),
    adapters.publish.diff(),
    adapters.publish.history(1),
  ]);

  const openJobs = jobs.filter((j) => j.state === "open").length;
  const newSubs = submissions.filter((s) => s.status === "new").length;
  const newApps = applications.filter((a) => a.status === "new").length;
  const changed = diff.filter((d) => d.changed);
  const changedGroups = [...new Set(changed.map((d) => d.label))];
  const recent = submissions.slice(0, 5);
  const lastPublish = history[0];

  return (
    <>
      <PageHeader
        title={`Welcome, ${session.name.split(" ")[0]}`}
        description="Snapshot of content, careers and contact activity. Publishing is a local stand-in until Supabase lands."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Open roles" value={openJobs} href="/careers" />
        <StatCard label="New submissions" value={newSubs} href="/contact" />
        <StatCard label="New applications" value={newApps} href="/careers" />
        <StatCard label="Media assets" value={media.length} href="/media" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Unpublished changes */}
        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Unpublished changes
            </h2>
            <Link href="/publish" className="text-xs text-primary hover:underline">
              Publish center →
            </Link>
          </div>
          {changedGroups.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              Draft matches the last publish — nothing to deploy.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {changedGroups.map((g) => (
                <li key={g} className="flex items-center gap-2 text-sm">
                  <span className="badge badge-amber">changed</span>
                  {g}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[0.7rem] text-muted">
            {lastPublish
              ? `Last published ${formatDate(lastPublish.publishedAt)} by ${lastPublish.publishedBy}.`
              : "Never published from the dashboard yet."}
          </p>
        </section>

        {/* Recent submissions */}
        <section className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-strong">
              Recent contact submissions
            </h2>
            <Link href="/contact" className="text-xs text-primary hover:underline">
              Inbox →
            </Link>
          </div>
          <div className="mt-2 overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="font-medium text-strong">{s.name}</div>
                      <div className="text-[0.7rem] text-muted">
                        {formatDate(s.createdAt)}
                      </div>
                    </td>
                    <td className="capitalize">{s.inquiryType}</td>
                    <td>
                      <span className={statusBadgeClass(s.status)}>
                        {titleCase(s.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
