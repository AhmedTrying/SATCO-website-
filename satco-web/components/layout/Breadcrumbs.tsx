import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

/** L2/sub-page orientation trail; final item is the current page (plan §6). */
export function Breadcrumbs({
  items,
  onDark,
  className,
}: {
  items: Crumb[];
  onDark?: boolean;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-5", className)}>
      <ol
        className={cn(
          "m-0 flex list-none flex-wrap items-center gap-2 p-0 text-[13px]",
          onDark ? "text-stone-50/75" : "text-stone-600",
        )}
      >
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden="true" className={cn("rtl:-scale-x-100", onDark && "opacity-60")}>
                  ›
                </span>
              )}
              {last || !item.href ? (
                <span
                  aria-current={last ? "page" : undefined}
                  className={onDark ? "text-bronze-200" : "font-medium text-bronze-800"}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "no-underline transition-colors",
                    onDark
                      ? "text-stone-50/80 hover:text-white"
                      : "text-stone-600 hover:text-bronze-800",
                  )}
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
