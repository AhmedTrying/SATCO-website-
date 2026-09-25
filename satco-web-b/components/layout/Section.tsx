import { cn } from "@/lib/utils";

const backgrounds = {
  default: "bg-bg",
  alt: "bg-stone-100",
  sand: "bg-sand",
  dark: "on-dark bg-stone-900 text-stone-300",
} as const;

export function Section({
  id,
  labelledBy,
  background = "default",
  className,
  children,
}: {
  id?: string;
  /** id of the heading naming this section (plan §9 — every section labelled) */
  labelledBy?: string;
  background?: keyof typeof backgrounds;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-[var(--section-y)]", backgrounds[background], className)}
    >
      {children}
    </section>
  );
}
