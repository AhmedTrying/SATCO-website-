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
        title="Contact submissions"
        description="Triage inbound inquiries. Routing follows the comment-#22 proposal (partnerships/opportunities → BD + Info, procurement → Procurement + Info, careers → HR, general → Info)."
      />
      <SubmissionsInbox submissions={submissions} staff={staff} />

      <p className="mt-6 text-xs text-muted">
        <strong>Seam (TODO Supabase):</strong> the site inserts into{" "}
        <code>contact_submissions</code> (anon key, RLS insert-only); an Edge
        Function emails the routed department (Resend/SES) and applies spam
        protection (CAPTCHA + honeypot + rate limit). Department email addresses
        are still pending (plan §16 Q3).
      </p>
    </>
  );
}
