import type { Ref } from "react";
import { Emblem } from "@/components/ui/Emblem";
import { site } from "@/content/site";

/*
 * Option C: the emblem + SATCO wordmark at header size. The header and the home
 * hero both render this exact markup (the hero scales it up with a CSS
 * transform), so the logo can hand over between them without a visible change
 * (see components/layout/useLogoDock.ts). The wordmark colour comes from the
 * surrounding --wordmark; --logo-wordmark overrides it while the logo moves.
 */
export function LogoLockup({
  id,
  className = "",
  ref,
}: {
  id?: string;
  className?: string;
  ref?: Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      id={id}
      className={`inline-flex items-center gap-[11px] ${className}`}
    >
      <Emblem size={34} />
      <span className="font-display text-[23px] font-bold leading-none tracking-[0.16em] text-[var(--logo-wordmark,var(--wordmark))]">
        {site.name}
      </span>
    </span>
  );
}
