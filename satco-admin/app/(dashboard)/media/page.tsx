import { MediaLibrary } from "@/components/editors/MediaLibrary";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const media = await adapters.media.list();

  return (
    <>
      <PageHeader
        title="Media library"
        description="Upload assets and set alt text (required for public media). Client logos preview in grayscale."
      />
      <MediaLibrary initial={media} canEdit={canEdit} />
    </>
  );
}
