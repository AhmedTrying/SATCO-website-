import Link from "next/link";
import { cn } from "@/lib/utils";

/** Inline "label →" link; the gap widens on hover (design signature). */
export function ArrowLink({
  href,
  className,
  tone = "light",
  children,
}: {
  href: string;
  className?: string;
  /** "dark" flips to the bronze-300 on-dark palette (AA on stone-950) */
  tone?: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-[7px] text-[15px] font-semibold no-underline transition-[gap,color] duration-[var(--dur-base)] hover:gap-3",
        tone === "dark"
          ? "text-bronze-300 hover:text-bronze-200"
          : "text-bronze-800 hover:text-bronze-700",
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
