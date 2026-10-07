import { Shell } from "@/components/shell/Shell";
import { requireSession } from "@/lib/auth";
import { navFor } from "@/lib/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const backend = process.env.DATA_BACKEND ?? "local";
  return (
    <Shell session={session} sections={navFor(session)} backend={backend}>
      {children}
    </Shell>
  );
}
