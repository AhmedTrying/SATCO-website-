import { ROLES, ROLE_CAPABILITIES, type RoleCapability } from "@satco/shared";

import { UsersManager } from "@/components/editors/UsersManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const CAP_LABELS: Record<RoleCapability, string> = {
  view: "See dashboard & drafts",
  edit: "Create/edit drafts, upload media",
  publish: "Publish + trigger rebuild",
  manageJobs: "Open/close jobs, triage submissions",
  downloadCv: "Download CVs (private bucket)",
  admin: "Manage users, roles, settings, flags",
};
const ALL_CAPS = Object.keys(CAP_LABELS) as RoleCapability[];

function RoleMatrix() {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="tbl">
        <thead>
          <tr>
            <th>Capability</th>
            {ROLES.map((r) => (
              <th key={r} className="text-center capitalize">
                {r}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_CAPS.map((cap) => (
            <tr key={cap}>
              <td>{CAP_LABELS[cap]}</td>
              {ROLES.map((r) => (
                <td key={r} className="text-center">
                  {ROLE_CAPABILITIES[r].includes(cap) ? (
                    <span className="text-success">✓</span>
                  ) : (
                    <span className="text-stone-300">·</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function UsersPage() {
  const session = await requireCapability("admin");
  const [users, audit] = await Promise.all([
    adapters.auth.listUsers(),
    adapters.audit.list(200),
  ]);

  return (
    <>
      <PageHeader
        title="Users & roles"
        description="Manage staff access and review the audit trail."
      />
      <Tabs
        tabs={[
          {
            id: "users",
            label: `Users (${users.length})`,
            content: <UsersManager users={users} currentEmail={session.email} />,
          },
          {
            id: "roles",
            label: "Role matrix",
            content: <RoleMatrix />,
          },
          {
            id: "audit",
            label: `Audit log (${audit.length})`,
            content: (
              <div className="card overflow-x-auto">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>When</th>
                      <th>Actor</th>
                      <th>Action</th>
                      <th>Entity</th>
                      <th>Summary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a) => (
                      <tr key={a.id}>
                        <td className="whitespace-nowrap">{formatDate(a.ts)}</td>
                        <td>{a.actor}</td>
                        <td>
                          <code className="text-xs">{a.action}</code>
                        </td>
                        <td>{a.entity}</td>
                        <td>{a.summary}</td>
                      </tr>
                    ))}
                    {audit.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-muted">
                          No audit entries yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}
