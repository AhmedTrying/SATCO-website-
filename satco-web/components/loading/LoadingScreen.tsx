"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { flags } from "@/content/flags";

/*
 * LOCKED SPEC — docx comment #2 (Bandar, 2025-12-16). Do not reinterpret:
 * 1.2s total (fade in 300ms → hold 600ms → fade out 300ms), fade ONLY,
 * ease-in-out/linear only, white/off-white background, no imagery/gradients/
 * overlays, Inter regular/medium (NOT bold), letter-spacing +2–4%, centred,
 * text frozen: site.loadingText. Once per session (sessionStorage), never on
 * internal navigation, never blocks scrolling after fade-out.
 * prefers-reduced-motion: skip ENTIRELY (not a faster fade).
 *
 * The duration is a single variable (DEFAULT_DURATION) with a review-only
 * comparison control (1.2/1.5/2/3s + replay) for the open client disagreement
 * (plan §12 Q15, Tarek vs Bandar). Remove by flipping SHOW_REVIEW_CONTROL.
 */

// Now driven by feature flags (dashboard kickoff §6 / plan §8). The picker cap
// (≤1.5s) and fade-only spec stay locked; the dashboard enforces the cap.
const DEFAULT_DURATION = flags.loading_duration_ms;
const REVIEW_DURATIONS = [1200, 1500, 2000, 3000];
/** Review-only control — toggled by the show_review_control flag. */
const SHOW_REVIEW_CONTROL = flags.show_review_control;
const STORAGE_KEY = "satco_intro_seen";

type Phase = "hidden" | "in" | "hold" | "out";

export function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const timers = useRef<number[]>([]);

  const play = (total: number) => {
    timers.current.forEach(window.clearTimeout);
    const fade = Math.round(total * 0.25);
    const hold = Math.round(total * 0.5);
    // "in" is scheduled too so the whole sequence runs from timer callbacks
    timers.current = [
      window.setTimeout(() => setPhase("in"), 0),
      window.setTimeout(() => setPhase("hold"), 20),
      window.setTimeout(() => setPhase("out"), 20 + fade + hold),
      window.setTimeout(() => setPhase("hidden"), 20 + fade + hold + fade + 40),
    ];
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — treat as unseen */
    }
    if (reduced || seen) return; // skip entirely
    play(DEFAULT_DURATION);
    const t = timers;
    // reads .current at cleanup time so replay-created timers are cleared too
    return () => t.current.forEach(window.clearTimeout);
  }, []);

  const fade = Math.round(duration * 0.25);

  return (
    <>
      {phase !== "hidden" && (
        <div
          aria-hidden="true"
          // pointer-events-none: the overlay is purely visual and must never
          // block scrolling or clicks (locked behaviour)
          className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-[#FCFBF9]"
          style={{
            // "in" mounts at 0; the 20ms timer flips to "hold" (1) so the fade
            // animates; "out" transitions back to 0. Pure fade — locked spec.
            opacity: phase === "hold" ? 1 : 0,
            transition: `opacity ${fade}ms ease-in-out`,
          }}
        >
          <p className="m-0 px-6 text-center font-sans text-[clamp(1.05rem,2.6vw,1.5rem)] font-medium tracking-[0.035em] text-stone-700">
            {site.loadingText}
          </p>
        </div>
      )}

      {SHOW_REVIEW_CONTROL && (
        <div className="fixed bottom-3 start-3 z-[210] max-w-[calc(100vw-24px)] rounded-md border border-stone-300 bg-white/95 p-[9px_11px] shadow-md">
          <div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.05em] text-stone-500">
            Review only — not part of the site
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="me-0.5 text-[11px] text-stone-600">Intro timing</span>
            {REVIEW_DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                aria-pressed={duration === d}
                className={`min-h-[34px] cursor-pointer rounded-[100px] border px-[11px] py-[7px] text-xs font-semibold ${
                  duration === d
                    ? "border-bronze-800 bg-bronze-800 text-white"
                    : "border-stone-300 bg-surface text-stone-700"
                }`}
                onClick={() => {
                  setDuration(d);
                  play(d);
                }}
              >
                {d / 1000}s
              </button>
            ))}
            <button
              type="button"
              className="min-h-[34px] cursor-pointer rounded-[100px] border border-bronze-300 bg-bronze-50 px-[13px] py-[7px] text-xs font-semibold text-bronze-800"
              onClick={() => play(duration)}
            >
              Replay intro
            </button>
          </div>
        </div>
      )}
    </>
  );
}
