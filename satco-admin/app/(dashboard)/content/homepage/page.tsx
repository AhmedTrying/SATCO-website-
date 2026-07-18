import { HomeCopyEditor } from "@/components/editors/HomeCopyEditor";
import { StatsEditor } from "@/components/editors/StatsEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomepageContentPage() {
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const draft = await adapters.content.getDraft();

  return (
    <>
      <PageHeader
        title="Homepage"
        description="Hero, stat band and teaser copy. Stat #3 has no figure yet — leave it pending; never invent a number."
      />
      <Tabs
        tabs={[
          {
            id: "copy",
            label: "Copy",
            content: <HomeCopyEditor initial={draft.home} canEdit={canEdit} />,
          },
          {
            id: "stats",
            label: "Stats",
            content: <StatsEditor initial={draft.stats} canEdit={canEdit} />,
          },
        ]}
      />
    </>
  );
}
