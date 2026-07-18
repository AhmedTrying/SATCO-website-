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

export default async function CareersPage() {
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
        description="Manage job postings and triage applications. Dashboard is the source of truth; a LinkedIn/ATS feed importer can mirror into the same jobs later (plan §9)."
      />
      <Tabs
        tabs={[
          {
            id: "jobs",
            label: `Jobs (${jobs.length})`,
            content: (
              <JobsManager
                jobs={jobs}
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

      <p className="mt-6 text-xs text-muted">
        <strong>Seam (TODO Supabase):</strong> jobs live in a <code>jobs</code> table
        read at runtime by the site (state = open); applications insert from the
        site with CVs in a private bucket, downloadable here via signed URLs. An
        optional Edge Function imports a LinkedIn/ATS feed into the same table
        (dedupe by external id). No PDF-only or email-only apply (comment #42).
      </p>
    </>
  );
}
