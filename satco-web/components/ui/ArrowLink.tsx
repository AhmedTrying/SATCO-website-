import Link from "next/link";
import { cn } from "@/lib/utils";

/** Inline "label →" link; the gap widens on hover (design signature). */
export function ArrowLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-[7px] text-[15px] font-semibold text-bronze-800 no-underline transition-[gap,color] duration-[var(--dur-base)] hover:gap-3 hover:text-bronze-700",
        className,
      )}
    >
      {children}{" "}
      <span aria-hidden="true" className="rtl:-scale-x-100">
        →
      </span>
    </Link>
  );
}
