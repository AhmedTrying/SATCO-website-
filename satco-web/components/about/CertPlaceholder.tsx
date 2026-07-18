import { cn } from "@/lib/utils";

/**
 * Labelled certificate-image placeholder — the client wants certificate visuals
 * on the site (docx comment #28) but the files are pending (plan §12 Q18).
 * Swap for the real scan via Certification.image when provided.
 */
export function CertPlaceholder({
  label,
  size = "sm",
  className,
}: {
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims = { sm: "h-16 w-[50px] text-[7px]", md: "h-[68px] w-[54px] text-[7.5px]", lg: "h-[90px] w-[72px] text-[8px]" }[size];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex flex-none items-center justify-center rounded-[6px] border border-bronze-200 bg-[repeating-linear-gradient(135deg,var(--bronze-50),var(--bronze-50)_6px,#fff_6px,#fff_12px)] p-1 text-center font-mono text-bronze-500",
        dims,
        className,
      )}
    >
      {label}
    </div>
  );
}
