import { Shell } from "@/components/shell/Shell";
import { requireSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const backend = process.env.DATA_BACKEND ?? "local";
  return (
    <Shell session={session} backend={backend}>
      {children}
    </Shell>
  );
}
