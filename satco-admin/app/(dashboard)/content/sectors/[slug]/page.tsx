import Link from "next/link";
import { notFound } from "next/navigation";

import { SectorEditor } from "@/components/editors/SectorEditor";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SectorEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const draft = await adapters.content.getDraft();
  const sector = draft.sectors.find((s) => s.slug === slug);
  if (!sector) notFound();

  return (
    <>
      <div className="mb-2">
        <Link href="/content/sectors" className="text-xs text-primary hover:underline">
          ← All sectors
        </Link>
      </div>
      <PageHeader title={sector.name} description={sector.tagline} />
      <SectorEditor initial={sector} canEdit={canEdit} />
    </>
  );
}
