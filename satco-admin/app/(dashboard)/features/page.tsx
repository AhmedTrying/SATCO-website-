import { FlagsEditor } from "@/components/editors/FlagsEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function FeaturesPage() {
  // Flags/settings are admin-only (plan §4).
  await requireCapability("admin");
  const draft = await adapters.content.getDraft();

  return (
    <>
      <PageHeader
        title="Features & settings"
        description="Build-time flags baked into the site on publish. Changing one queues a rebuild like any content edit."
      />
      <FlagsEditor initial={draft.flags} canEdit />
    </>
  );
}
