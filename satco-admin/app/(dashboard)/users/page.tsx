import { ACCESS_PAGES } from "@satco/shared";

import { PAGE_LABELS, UsersManager } from "@/components/users/UsersManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { adapters } from "@/lib/adapters";
import { authMode, requireCapability } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGE_NOTES: Record<string, string> = {
  jobs: "Create, publish, pause and close jobs; triage applications; download CVs.",
  partnerships: "Inquiries sent with the \"Discuss partnerships\" option.",
  opportunities: "Inquiries sent with the \"Opportunities\" option.",
  procurement: "Inquiries sent with the \"Procurement\" option.",
  careers: "Inquiries sent with the \"Careers\" option (not job applications).",
  general: "Inquiries sent with the \"General inquiries\" option.",
};

function AccessModel() {
  return (
    <div className="space-y-3">
      <div className="card overflow-x-auto p-0">
        <table className="tbl">
          <thead>
            <tr>
              <th>Page</th>
              <th>What it allows</th>
              <th className="text-center">staff</th>
              <th className="text-center">admin</th>
            </tr>
          </thead>
          <tbody>
            {ACCESS_PAGES.map((page) => (
              <tr key={page}>
                <td className="font-medium text-strong">{PAGE_LABELS[page]}</td>
                <td>{PAGE_NOTES[page]}</td>
                <td className="text-center text-muted">if granted</td>
                <td className="text-center text-success">✓</td>
              </tr>
            ))}
            <tr>
              <td className="font-medium text-strong">Users &amp; access, audit log</td>
              <td>Add people, change roles and page access, deactivate accounts, delete jobs.</td>
              <td className="text-center text-stone-300">·</td>
              <td className="text-center text-success">✓</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="hint">
        Two roles only. Staff see exactly the pages ticked on their account; admins see
        everything. Every page is also checked on the server, so a link alone never grants access.
      </p>
    </div>
  );
}

export default async function UsersPage() {
  const session = await requireCapability("admin");
  const [users, audit] = await Promise.all([
    adapters.users.list(),
    adapters.audit.list(200),
  ]);

  return (
    <>
      <PageHeader
        title="Users & access"
        description="Who can sign in and which pages they can open."
      />
      <Tabs
        tabs={[
          {
            id: "users",
            label: `Users (${users.length})`,
            content: (
              <UsersManager
                users={users}
                currentUserId={session.userId}
                signInMode={authMode()}
              />
            ),
          },
          {
            id: "roles",
            label: "Access model",
            content: <AccessModel />,
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
