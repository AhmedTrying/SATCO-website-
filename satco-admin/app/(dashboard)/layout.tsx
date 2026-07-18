import { Shell } from "@/components/shell/Shell";
import { requireSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  return <Shell session={session}>{children}</Shell>;
}
