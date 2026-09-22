import {
  ApplicationsInbox,
  GeneralApplicationsInbox,
} from "@/components/careers/ApplicationsInbox";
import { JobsManager } from "@/components/careers/JobsManager";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CareersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; job?: string }>;
}) {
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const canManage = can(session, "manageJobs");
  const canDownloadCv = can(session, "downloadCv");
  const canDelete = can(session, "admin");

  const [jobs, applications, general] = await Promise.all([
    adapters.jobs.list(),
    adapters.submissions.listApplications(),
    adapters.submissions.listGeneralApplications(),
  ]);
  const params = await searchParams;
  const summary = [
    { label: "Open jobs", value: jobs.filter((job) => job.state === "published").length },
    { label: "Draft jobs", value: jobs.filter((job) => job.state === "draft").length },
    { label: "Closed jobs", value: jobs.filter((job) => job.state === "closed").length },
    { label: "Total applications", value: applications.length },
  ];

  const restricted = (
    <div className="card p-6 text-sm text-muted">
      Applications contain personal data — visible to publishers and admins only.
      Switch to a higher role to view.
    </div>
  );

  return (
    <>
      <PageHeader
        title="Careers"
        description="Manage vacancies and move candidates through a clear recruitment process."
      />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="card px-4 py-3">
            <p className="text-xs font-medium text-muted">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-strong">{item.value}</p>
          </div>
        ))}
      </div>
      <Tabs
        key={params.tab ?? "jobs"}
        initialId={params.tab}
        tabs={[
          {
            id: "jobs",
            label: `Jobs (${jobs.length})`,
            content: (
              <JobsManager
                jobs={jobs}
                applications={applications}
                canEdit={canEdit}
                canManage={canManage}
                canDelete={canDelete}
              />
            ),
          },
          {
            id: "applications",
            label: `Applications (${applications.length})`,
            content: canManage ? (
              <ApplicationsInbox
                applications={applications}
                canManage={canManage}
                canDownloadCv={canDownloadCv}
                initialJobId={params.job}
              />
            ) : (
              restricted
            ),
          },
          {
            id: "general",
            label: `General (${general.length})`,
            content: canManage ? (
              <GeneralApplicationsInbox
                applications={general}
                canManage={canManage}
                canDownloadCv={canDownloadCv}
              />
            ) : (
              restricted
            ),
          },
        ]}
      />

    </>
  );
}
