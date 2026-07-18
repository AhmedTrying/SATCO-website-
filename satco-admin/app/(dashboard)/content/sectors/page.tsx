import Link from "next/link";

import { SectorsGlobal } from "@/components/editors/SectorsGlobal";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { can, requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function SectorsPage() {
  const session = await requireSession();
  const canEdit = can(session, "edit");
  const draft = await adapters.content.getDraft();

  return (
    <>
      <PageHeader
        title="Sectors"
        description="Edit the four operating sectors, the intro, and the Selected Experience publishing switch."
      />

      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        {[...draft.sectors]
          .sort((a, b) => a.order - b.order)
          .map((s) => (
            <Link
              key={s.slug}
              href={`/content/sectors/${s.slug}`}
              className="card flex items-center justify-between p-4 transition-colors hover:border-bronze-300"
            >
              <div>
                <div className="text-sm font-semibold text-strong">{s.name}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {s.capabilities.length} capabilities ·{" "}
                  {s.experience.status === "pending-decision"
                    ? "experience pending"
                    : "experience confirmed"}
                </div>
              </div>
              <span aria-hidden="true" className="text-bronze-500">
                →
              </span>
            </Link>
          ))}
      </div>

      <SectorsGlobal
        intro={draft.sectorsIntro}
        showPendingExperience={draft.showPendingExperience}
        pendingExperienceCard={draft.pendingExperienceCard}
        canEdit={canEdit}
      />
    </>
  );
}
