"use client";

import { useState } from "react";
import { Picture } from "@/components/ui/Picture";

/*
 * Option C — About us "build, then operate" comparison.
 *
 * Two aerials at the same angle: a community under construction (left,
 * "Build") and the finished, running village (right, "Operate"). Dragging the
 * bronze divider — or the arrow keys on it — moves between the two, which is
 * the model the intro describes ("we build it, then we operate it").
 *
 * The control is a native range input stretched over the image (invisible,
 * so the whole picture is draggable and it keeps keyboard/AT semantics); the
 * visible handle shows its focus ring via `peer-focus-visible`. Imagery is
 * decorative (empty alt): the copy beside it carries the meaning.
 * dir="ltr" keeps the picture order and the slider direction aligned under RTL.
 */
export function BuildOperate({
  buildLabel,
  operateLabel,
  controlLabel,
}: {
  buildLabel: string;
  operateLabel: string;
  controlLabel: string;
}) {
  const [pos, setPos] = useState(50);

  return (
    <div
      dir="ltr"
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-lg bg-stone-900 shadow-lg ring-1 ring-white/10 sm:aspect-[16/10]"
    >
      {/* Operate — the full frame underneath */}
      <Picture
        image={{ src: "neom", alt: "" }}
        sizes="(min-width: 1024px) 56vw, 100vw"
        priority
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover"
      />
      {/* Build — clipped to the left of the divider */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Picture
          image={{ src: "construction-2", alt: "" }}
          sizes="(min-width: 1024px) 56vw, 100vw"
          priority
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      </div>

      {/* Legibility scrim along the top for the two labels */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgb(24_21_18/0.55),transparent)]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute start-4 top-4 font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity duration-[var(--dur-base)]"
        style={{ opacity: pos > 12 ? 1 : 0 }}
      >
        {buildLabel}
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute end-4 top-4 font-display text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-opacity duration-[var(--dur-base)]"
        style={{ opacity: pos < 88 ? 1 : 0 }}
      >
        {operateLabel}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={pos}
        aria-label={controlLabel}
        aria-valuetext={`${pos}% ${buildLabel}, ${100 - pos}% ${operateLabel}`}
        onChange={(e) => setPos(Number(e.target.value))}
        // touch-pan-y: a vertical swipe over the picture still scrolls the page on phones
        className="peer absolute inset-0 z-[2] m-0 h-full w-full cursor-ew-resize touch-pan-y appearance-none bg-transparent opacity-0"
      />

      {/* Divider + handle (follows the input; focus ring via peer) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 z-[1] w-[2px] -translate-x-1/2 bg-bronze-300 shadow-[0_0_0_1px_rgb(24_21_18/0.25)] peer-focus-visible:bg-white"
        style={{ left: `${pos}%` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-[1] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bronze-300 bg-[#181512]/80 text-bronze-200 shadow-md backdrop-blur-[2px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white"
        style={{ left: `${pos}%` }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 7 4 12 9 17" />
          <polyline points="15 7 20 12 15 17" />
        </svg>
      </div>
    </div>
  );
}
