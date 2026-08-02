"use client";

import { useEffect, useRef, useState } from "react";
import { home } from "@/content/home";
import { statPendingNote, stats } from "@/content/stats";
import type { Stat } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";
import { LottieIcon } from "@/components/motion/LottieIcon";
import communitiesAnim from "@/assets/lottie/communities.json";
import populationAnim from "@/assets/lottie/population.json";
import assetsAnim from "@/assets/lottie/assets.json";
import environmentsAnim from "@/assets/lottie/environments.json";

/*
 * Six count-up stats (plan §7): numbers animate 0→target once on scroll-into-
 * view; only the numeric part animates, suffixes preserved, tabular figures.
 * Stat #3 has no figure — renders the placeholder, never an invented number.
 * Reduced motion: final values immediately.
 */

/*
 * Animated Lottie icons per stat (client-supplied, bronze-700 stroke +
 * bronze-200 fill) — presentation only, keyed by stat id here rather than in
 * the content model so the shared schema and dashboard stay untouched. They
 * play once alongside the count-up. Stats not in this map fall back to the
 * static line icons below until their JSON exports arrive (aircrafts,
 * airports — the img/Icons GIF versions are off-brand and can't honor
 * reduced motion, so they are deliberately not used).
 */
const STAT_LOTTIES: Record<string, object> = {
  communities: communitiesAnim,
  population: populationAnim,
  assets: assetsAnim,
  environments: environmentsAnim,
};

/*
 * Static line icons (UCC-reference upgrade) — fallback for stats whose
 * animated JSON hasn't been supplied yet. Decorative (aria-hidden): the
 * labels carry meaning.
 */
const STAT_ICONS: Record<string, React.ReactNode> = {
  aircrafts: (
    // Aircraft taking off
    <>
      <path d="M3 20h18" />
      <path d="M3.8 14.2l4.6 1.3 9.3-6.3c.9-.6 2.1-.4 2.7.4.6.9.3 2-.6 2.6l-11 6.3-6.4-1.8z" />
    </>
  ),
  airports: (
    // Control tower
    <>
      <path d="M8 8h8l-1.4 5.5H9.4z" />
      <path d="M10.7 13.5V20M13.3 13.5V20" />
      <path d="M8.8 8V5h6.4v3" />
      <path d="M12 5V2.8" />
      <path d="M8 20h8" />
    </>
  ),
};

/*
 * Small-caps caption under each label (1C band design). Uses the stat's
 * content `unit` when present; these are presentation-only fallbacks (same
 * pattern as STAT_LOTTIES/STAT_ICONS) for stats that carry no unit in the
 * content model — they echo the label, they are not data claims.
 */
const STAT_UNIT_FALLBACK: Record<string, string> = {
  communities: "Communities",
  aircrafts: "Aircraft",
  airports: "Airports",
};

function StatIcon({ id }: { id: string }) {
  const icon = STAT_ICONS[id];
  if (!icon) return null;
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-bronze-700"
    >
      {icon}
    </svg>
  );
}

function format(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function StatNumber({ stat, run }: { stat: Stat; run: boolean }) {
  const [display, setDisplay] = useState(stat.countUp ? "0" : stat.display);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current || stat.value === null || !stat.countUp) return;
    done.current = true;
    const target = stat.value;
    const decimals = stat.decimals ?? 0;
    const suffix = stat.suffix ?? "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Snap straight to the final value — scheduled so the state update runs
      // from a callback rather than the effect body.
      const t = window.setTimeout(() => setDisplay(format(target, decimals) + suffix), 0);
      return () => window.clearTimeout(t);
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(format(target * eased, decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(format(target, decimals) + suffix);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, stat]);

  if (stat.value === null) {
    // Placeholder — never an invented number; announced meaningfully to AT
    return (
      <div className="font-display text-[clamp(1.9rem,2.6vw,2.4rem)] font-bold leading-none text-bronze-700 tabular-nums">
        <span aria-hidden="true">{stat.display}</span>
        <span className="sr-only">{statPendingNote}</span>
      </div>
    );
  }
  // 1C band design: a trailing "+" renders as a smaller raised glyph
  const plus = display.endsWith("+");
  return (
    <div className="font-display text-[clamp(1.9rem,2.6vw,2.4rem)] font-bold leading-none text-bronze-700 tabular-nums">
      {plus ? display.slice(0, -1) : display}
      {plus ? <span className="align-super text-[0.55em]">+</span> : null}
    </div>
  );
}

export function StatBand() {
  const bandRef = useRef<HTMLUListElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Reduced motion needs no special case here: StatNumber snaps to the final
    // value (no animation) once the band scrolls into view.
    const el = bandRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRun(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section aria-labelledby="stat-h" className="border-b border-border bg-bg">
      <Container className="py-[clamp(3rem,6vw,5rem)]">
        <div className="grid gap-x-[clamp(2.5rem,5vw,4.5rem)] gap-y-11 lg:grid-cols-[minmax(0,4fr)_minmax(0,9fr)]">
          {/* Title block (1C band design) */}
          <div>
            <Reveal>
              <div aria-hidden="true" className="mb-4 h-[3px] w-9 rounded-full bg-bronze-600" />
            </Reveal>
            <Reveal delay={40}>
              <p className="mb-2 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700">
                {home.statBand.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="stat-h"
                className="my-0 font-display text-[clamp(1.6rem,2.4vw,2.1rem)] font-bold leading-[1.16] tracking-[-0.015em] text-strong"
              >
                {home.statBand.heading}
              </h2>
            </Reveal>
            {home.statBand.lede ? (
              <Reveal delay={120}>
                <p className="mb-0 mt-4 max-w-[40ch] text-[15px] leading-[1.65] text-stone-600">
                  {home.statBand.lede}
                </p>
              </Reveal>
            ) : null}
          </div>
          {/* Ruled stat rows, two columns */}
          <ul
            ref={bandRef}
            className="m-0 grid list-none grid-cols-1 content-start gap-x-12 gap-y-7 p-0 sm:grid-cols-2"
          >
            {stats.map((stat, i) => (
              <li key={stat.id} className="border-t border-border pt-[18px]">
                <Reveal delay={i * 70}>
                  <div className="flex items-start gap-3.5">
                    {STAT_LOTTIES[stat.id] ? (
                      <LottieIcon
                        data={STAT_LOTTIES[stat.id]}
                        play={run}
                        size={28}
                        className="shrink-0"
                      />
                    ) : (
                      <StatIcon id={stat.id} />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium leading-[1.35] text-strong">
                        {stat.label}
                      </div>
                      {(stat.unit ?? STAT_UNIT_FALLBACK[stat.id]) ? (
                        <div className="mt-1 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-stone-600">
                          {stat.unit ?? STAT_UNIT_FALLBACK[stat.id]}
                        </div>
                      ) : null}
                    </div>
                    <div className="shrink-0 text-end">
                      <StatNumber stat={stat} run={run} />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
