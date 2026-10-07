import { redirect } from "next/navigation";
import { accessibleInboxes } from "@satco/shared";

import { InquiriesInbox } from "@/components/inquiries/InquiriesInbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireSession } from "@/lib/auth";
import { inboxHref } from "@/lib/nav";

export const dynamic = "force-dynamic";

/** Every inbox this user may open, in one list. One inbox → go straight to it. */
export default async function InquiriesPage() {
  const session = await requireSession();
  const inboxes = accessibleInboxes(session);
  if (inboxes.length === 0) redirect("/denied");
  if (inboxes.length === 1) redirect(inboxHref(inboxes[0]));

  const [all, users] = await Promise.all([
    adapters.submissions.listContact(),
    adapters.users.list(),
  ]);
  const submissions = all.filter((s) => inboxes.includes(s.inquiryType));
  const staff = users.filter((u) => u.active).map((u) => u.email);

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="Every inbox you have access to. Open a single inbox from the sidebar to work one type at a time."
      />
      <InquiriesInbox submissions={submissions} staff={staff} inboxes={inboxes} />
    </>
  );
}
