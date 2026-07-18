import { PublishPanel } from "@/components/editors/PublishPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function PublishPage() {
  const session = await requireSession();
  const canPublish = can(session, "publish");
  const [diff, history] = await Promise.all([
    adapters.publish.diff(),
    adapters.publish.history(10),
  ]);
  const changed = diff.filter((d) => d.changed);
  const changedGroups = [...new Set(changed.map((d) => d.label))];

  return (
    <>
      <PageHeader
        title="Publish center"
        description="Review what changed since the last publish, then publish it to the site."
      />

      <div className="space-y-4">
        <PublishPanel changedCount={changedGroups.length} canPublish={canPublish} />

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">
            Changes since last publish
          </h2>
          {changedGroups.length === 0 ? (
            <p className="text-sm text-muted">
              Draft matches the last publish — nothing to deploy.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {changedGroups.map((g) => (
                <li key={g} className="flex items-center gap-2 text-sm">
                  <span className="badge badge-amber">changed</span>
                  {g}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-4">
          <h2 className="mb-3 text-sm font-semibold text-strong">Publish history</h2>
          {history.length === 0 ? (
            <p className="text-sm text-muted">Never published from the dashboard yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>By</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h.id}>
                      <td>{formatDate(h.publishedAt)}</td>
                      <td>{h.publishedBy}</td>
                      <td>{h.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
