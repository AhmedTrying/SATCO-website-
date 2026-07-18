import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-white hover:bg-primary-hover hover:text-white",
  onImage: "bg-white text-bronze-800 hover:bg-bronze-50 hover:text-bronze-800",
} as const;

/** Solid CTA link; the arrow gap widens on hover (design signature). */
export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-sm px-6 py-3.5 text-[15px] font-semibold no-underline transition-[gap,background-color] duration-[var(--dur-base)] hover:gap-[13px]",
        variants[variant],
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
