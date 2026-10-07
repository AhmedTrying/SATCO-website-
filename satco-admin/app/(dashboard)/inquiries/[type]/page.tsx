import { notFound } from "next/navigation";
import { INQUIRY_TYPES, type InquiryType } from "@satco/shared";

import { InquiriesInbox } from "@/components/inquiries/InquiriesInbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireInbox } from "@/lib/auth";
import { INQUIRY_LABELS, routeFor } from "@/lib/routing";

export const dynamic = "force-dynamic";

function isInquiryType(value: string): value is InquiryType {
  return (INQUIRY_TYPES as string[]).includes(value);
}

/** One inquiry inbox — its own page, with its own access grant. */
export default async function InboxPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!isInquiryType(type)) notFound();
  await requireInbox(type);

  const [submissions, users] = await Promise.all([
    adapters.submissions.listContact(type),
    adapters.users.list(),
  ]);
  const staff = users.filter((u) => u.active).map((u) => u.email);

  return (
    <>
      <PageHeader
        title={INQUIRY_LABELS[type]}
        description={`Messages sent through the website's "${INQUIRY_LABELS[type]}" option. Routed to: ${routeFor(type)}.`}
      />
      <InquiriesInbox submissions={submissions} staff={staff} inboxes={[type]} />
    </>
  );
}
