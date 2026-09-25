import { cn } from "@/lib/utils";

/** Small uppercase section label (bronze on light, bronze-200 on dark). */
export function Eyebrow({
  onDark,
  className,
  children,
}: {
  onDark?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "m-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em]",
        onDark ? "text-bronze-200" : "text-bronze-700",
        className,
      )}
    >
      {children}
    </p>
  );
}
