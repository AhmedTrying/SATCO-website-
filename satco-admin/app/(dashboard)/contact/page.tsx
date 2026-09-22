import { SubmissionsInbox } from "@/components/contact/SubmissionsInbox";
import { PageHeader } from "@/components/ui/PageHeader";
import { adapters } from "@/lib/adapters";
import { requireCapability } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  // Submissions are personal data — publisher/admin only (plan §4).
  await requireCapability("manageJobs");
  const [submissions, users] = await Promise.all([
    adapters.submissions.listContact(),
    adapters.auth.listUsers(),
  ]);
  const staff = users.filter((u) => u.active).map((u) => u.email);

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="Review, assign, and close website inquiries without leaving the inbox."
      />
      <SubmissionsInbox submissions={submissions} staff={staff} />
    </>
  );
}
