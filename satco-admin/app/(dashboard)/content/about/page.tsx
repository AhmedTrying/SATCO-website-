import { AboutCertifications } from "@/components/editors/AboutCertifications";
import { AboutClients } from "@/components/editors/AboutClients";
import { AboutCompany } from "@/components/editors/AboutCompany";
import { AboutLeadership } from "@/components/editors/AboutLeadership";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AboutContentPage() {
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const d = await adapters.content.getDraft();

  return (
    <>
      <PageHeader
        title="About"
        description="Company information, leadership, certifications and clients."
      />
      <Tabs
        tabs={[
          {
            id: "company",
            label: "Company",
            content: <AboutCompany initial={d.company} canEdit={canEdit} />,
          },
          {
            id: "leadership",
            label: "Leadership",
            content: (
              <AboutLeadership
                page={d.leadershipPage}
                members={d.leadership}
                canEdit={canEdit}
              />
            ),
          },
          {
            id: "certifications",
            label: "Certifications",
            content: (
              <AboutCertifications
                page={d.certificationsPage}
                classifications={d.classifications}
                licenses={d.licenses}
                certifications={d.certifications}
                canEdit={canEdit}
              />
            ),
          },
          {
            id: "clients",
            label: "Clients",
            content: <AboutClients page={d.clientsPage} clients={d.clients} canEdit={canEdit} />,
          },
        ]}
      />
    </>
  );
}
