"use client";

import { useEffect, useRef } from "react";

/*
 * Core-capability block: an expanded card on desktop, a tap-to-expand accordion
 * below 768px (plan §8). Server-renders open so content is accessible without
 * JS; on small viewports the effect collapses it after mount.
 */
export function CapabilityAccordion({
  index,
  title,
  body,
}: {
  index: number;
  title: string;
  body: string;
}) {
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      if (ref.current) ref.current.open = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <details
      ref={ref}
      open
      className="group overflow-hidden rounded-lg border border-border bg-surface"
    >
      <summary className="flex cursor-pointer items-start justify-between gap-4 px-[26px] py-6">
        <span className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="pt-[3px] font-display text-[13px] font-bold text-bronze-500"
          >
            {String(index).padStart(2, "0")}
          </span>
          <span className="font-display text-[1.15rem] font-bold leading-[1.28] text-strong">
            {title}
          </span>
        </span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--stone-400)"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          className="flex-none transition-transform duration-[var(--dur-base)] group-open:rotate-180"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="pb-[26px] pe-[26px] ps-[58px]">
        <p className="m-0 text-[15px] leading-[1.65] text-body">{body}</p>
      </div>
    </details>
  );
}
