"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { Emblem } from "@/components/ui/Emblem";
import { flags } from "@/content/flags";
import { site } from "@/content/site";

const DEFAULT_DURATION = flags.loading_duration_ms;
const REVIEW_DURATIONS = [1200, 1500];
const SHOW_REVIEW_CONTROL = flags.show_review_control;
const STORAGE_KEY = "satco_intro_seen_v2";

/*
 * Option A intro (user request 2026-10-04): slide-through. The SATCO lockup
 * slides in from the left and stops in the centre; after the hold, the whole
 * panel slides off to the right, uncovering the website from left to right
 * (mirrored in RTL). Departs from the Dec-2025 "fade only" lock; see
 * docs/VARIANTS.md.
 *
 * The whole timeline is CSS (globals.css `.intro-slide*`), so it runs from the
 * first paint of the server-rendered overlay rather than from hydration; JS
 * only unmounts it. ENTER_MS / EXIT_MS must match the CSS. The dashboard
 * duration sets the hold: 75% of it, as A's old hold-before-fade.
 */
const ENTER_MS = 1000;
const EXIT_MS = 1000;

function timeline(duration: number) {
  const exitAt = ENTER_MS + Math.round(duration * 0.75);
  return { exitAt, total: exitAt + EXIT_MS };
}

export function LoadingScreen() {
  // Render the opaque intro on the server so the website can never paint first.
  const [visible, setVisible] = useState(true);
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  // Remount key: a fresh overlay element restarts the CSS timeline on replay.
  const [run, setRun] = useState(0);
  const timers = useRef<number[]>([]);

  const play = (next: number) => {
    timers.current.forEach(window.clearTimeout);
    document.documentElement.removeAttribute("data-satco-intro");
    setDuration(next);
    setRun((n) => n + 1);
    setVisible(true);
    timers.current = [
      window.setTimeout(() => setVisible(false), timeline(next).total + 40),
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
      timers.current = [window.setTimeout(() => setVisible(false), 0)];
    } else {
      timers.current = [
        // Fallback: the exit animation's end normally unmounts the overlay first.
        window.setTimeout(
          () => setVisible(false),
          timeline(DEFAULT_DURATION).total + 40,
        ),
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

  const { exitAt } = timeline(duration);

  return (
    <>
      {visible && (
        <div
          key={run}
          aria-hidden="true"
          data-satco-intro="true"
          className="intro-slide pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-[#fcfbf9]"
          style={{ "--intro-exit-at": `${exitAt}ms` } as CSSProperties}
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget) setVisible(false);
          }}
        >
          <div className="intro-slide-in flex flex-col items-center px-6 text-center">
            <div className="flex items-center gap-4">
              <Emblem size={54} />
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
                onClick={() => play(option)}
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
