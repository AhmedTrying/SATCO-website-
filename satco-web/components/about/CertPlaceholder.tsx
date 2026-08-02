import { cn } from "@/lib/utils";

/**
 * Labelled certificate-image placeholder — the client wants certificate visuals
 * on the site (docx comment #28) but the files are pending (plan §12 Q18).
 * Drawn as a miniature framed certificate (inner rule, diamond seal, ghost text
 * lines) so the pending state still reads as designed. Decorative throughout
 * (aria-hidden). Swap for the real scan via Certification.image when provided.
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
  const dims = {
    sm: "h-16 w-[50px] text-[7px]",
    md: "h-[68px] w-[54px] text-[7.5px]",
    lg: "h-[90px] w-[72px] text-[8px]",
  }[size];
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex flex-none flex-col items-center justify-center gap-[3px] overflow-hidden rounded-[6px] border border-bronze-200 bg-[linear-gradient(180deg,#fff,var(--bronze-50))] p-1 text-center font-mono text-bronze-600",
        dims,
        className,
      )}
    >
      {/* inner certificate rule */}
      <span className="pointer-events-none absolute inset-[3px] rounded-[3px] border border-bronze-100" />
      {/* seal */}
      <span className="text-[1.3em] leading-none text-bronze-300">◆</span>
      <span className="px-1 leading-[1.2] tracking-[0.02em]">{label}</span>
      {/* ghost text lines */}
      <span className="h-px w-[55%] bg-bronze-200" />
      <span className="h-px w-[38%] bg-bronze-200" />
    </div>
  );
}
