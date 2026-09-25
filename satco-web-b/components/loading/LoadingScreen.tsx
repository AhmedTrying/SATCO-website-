"use client";

import { useEffect, useRef, useState } from "react";

import { Emblem } from "@/components/ui/Emblem";
import { flags } from "@/content/flags";
import { site } from "@/content/site";

const DEFAULT_DURATION = flags.loading_duration_ms;
const REVIEW_DURATIONS = [1200, 1500];
const SHOW_REVIEW_CONTROL = flags.show_review_control;
const STORAGE_KEY = "satco_intro_seen_v2";

type Phase = "hidden" | "hold" | "out";

export function LoadingScreen() {
  // Render the opaque intro on the server so the website can never paint first.
  const [phase, setPhase] = useState<Phase>("hold");
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const timers = useRef<number[]>([]);

  const play = (total: number) => {
    timers.current.forEach(window.clearTimeout);
    const fade = Math.round(total * 0.25);
    const hold = total - fade;

    document.documentElement.removeAttribute("data-satco-intro");
    setPhase("hold");

    timers.current = [
      window.setTimeout(() => setPhase("out"), hold),
      window.setTimeout(() => setPhase("hidden"), total + 40),
    ];
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;

    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // If storage is unavailable, show the intro once for this mount.
    }

    if (reduced || seen) {
      document.documentElement.dataset.satcoIntro = "skip";
      timers.current = [window.setTimeout(() => setPhase("hidden"), 0)];
    } else {
      const fade = Math.round(DEFAULT_DURATION * 0.25);
      const hold = DEFAULT_DURATION - fade;

      timers.current = [
        window.setTimeout(() => setPhase("out"), hold),
        window.setTimeout(() => setPhase("hidden"), DEFAULT_DURATION + 40),
        window.setTimeout(() => {
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            // The animation remains usable when storage is unavailable.
          }
        }, 50),
      ];
    }

    const activeTimers = timers;
    return () => activeTimers.current.forEach(window.clearTimeout);
  }, []);

  const fade = Math.round(duration * 0.25);

  return (
    <>
      {phase !== "hidden" && (
        <div
          aria-hidden="true"
          data-satco-intro="true"
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-[#fcfbf9]"
          style={{
            opacity: phase === "out" ? 0 : 1,
            transition: `opacity ${fade}ms ease-in-out`,
          }}
        >
          <div className="flex flex-col items-center px-6 text-center">
            <div className="flex items-center gap-4">
              <Emblem size={54} disc="var(--bronze-700)" land="var(--stone-500)" />
              <span className="font-display text-[clamp(1.75rem,4vw,2.4rem)] font-bold tracking-[0.2em] text-stone-950">
                {site.name}
              </span>
            </div>
            <div aria-hidden="true" className="my-6 h-px w-16 bg-bronze-600/60" />
            <p className="m-0 font-sans text-[clamp(1rem,2.2vw,1.35rem)] font-medium tracking-[0.035em] text-stone-700">
              {site.loadingText}
            </p>
          </div>
        </div>
      )}

      {SHOW_REVIEW_CONTROL && (
        <div className="fixed bottom-3 start-3 z-[210] max-w-[calc(100vw-24px)] rounded-md border border-stone-300 bg-white/95 p-[9px_11px] shadow-md">
          <div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.05em] text-stone-500">
            Review only — not part of the site
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {REVIEW_DURATIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={duration === option}
                className={`min-h-[34px] cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  duration === option
                    ? "border-bronze-800 bg-bronze-800 text-white"
                    : "border-stone-300 bg-white text-stone-700"
                }`}
                onClick={() => {
                  setDuration(option);
                  play(option);
                }}
              >
                {option / 1000}s
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
