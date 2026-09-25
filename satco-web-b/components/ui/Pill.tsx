import { cn } from "@/lib/utils";

/** Bronze-tinted tag pill (delivery models, meta tags). */
export function Pill({
  muted,
  className,
  children,
}: {
  /** Stone treatment for job-card meta tags */
  muted?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-[100px] text-sm font-semibold",
        muted
          ? "bg-stone-100 px-3 py-[5px] text-[12.5px] font-normal text-stone-600"
          : "border border-bronze-200 bg-bronze-50 px-[18px] py-[9px] text-bronze-800",
        className,
      )}
    >
      {children}
    </span>
  );
}
