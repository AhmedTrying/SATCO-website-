import { SiteSettingsEditor } from "@/components/editors/SiteSettingsEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SiteSettingsPage() {
  // Site settings are admin-only (plan §4).
  await requireCapability("admin");
  const draft = await adapters.content.getDraft();

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Identity, contact details and locked values."
      />
      <SiteSettingsEditor initial={draft.site} canEdit />
    </>
  );
}
