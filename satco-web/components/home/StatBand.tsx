"use client";

import { useEffect, useRef, useState } from "react";
import { home } from "@/content/home";
import { statPendingNote, stats } from "@/content/stats";
import type { Stat } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

/*
 * Six count-up stats (plan §7): numbers animate 0→target once on scroll-into-
 * view; only the numeric part animates, suffixes preserved, tabular figures.
 * Stat #3 has no figure — renders the placeholder, never an invented number.
 * Reduced motion: final values immediately.
 */

/*
 * Line icons per stat (UCC-reference upgrade) — presentation only, keyed by
 * stat id here rather than in the content model so the shared schema and
 * dashboard stay untouched. Decorative (aria-hidden): the labels carry meaning.
 */
const STAT_ICONS: Record<string, React.ReactNode> = {
  communities: (
    // Two neighbouring houses
    <>
      <path d="M3.5 11.5 8.5 7l5 4.5" />
      <path d="M5 10.2V19h7v-8.8" />
      <path d="M12 19h7v-6.2L15.7 9.9 13.4 12" />
    </>
  ),
  population: (
    // People group
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.6-3 2.9-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
      <circle cx="16.8" cy="9.6" r="2.3" />
      <path d="M15.6 14.8c2.4.3 4.2 1.7 4.9 4.2" />
    </>
  ),
  assets: (
    // Building blocks
    <>
      <path d="M3 19.5h18" />
      <rect x="4.5" y="8" width="6" height="11.5" />
      <rect x="13.5" y="4.5" width="6.5" height="15" />
      <path d="M6.5 11h2M6.5 14h2M15.7 8h2M15.7 11h2M15.7 14h2" />
    </>
  ),
  environments: (
    // Stacked built area (sqm)
    <>
      <path d="M12 3.5 20 8l-8 4.5L4 8z" />
      <path d="M4 12.5 12 17l8-4.5" />
      <path d="M4 17 12 21.5 20 17" />
    </>
  ),
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

function StatIcon({ id }: { id: string }) {
  const icon = STAT_ICONS[id];
  if (!icon) return null;
  return (
    <svg
      aria-hidden="true"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mb-3.5 text-bronze-700"
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
      <div className="font-display text-[clamp(2.1rem,4vw,3rem)] font-bold leading-none text-stone-600 tabular-nums">
        <span aria-hidden="true">{stat.display}</span>
        <span className="sr-only">{statPendingNote}</span>
      </div>
    );
  }
  return (
    <div className="font-display text-[clamp(2.1rem,4vw,3rem)] font-bold leading-none text-bronze-800 tabular-nums">
      {display}
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
    <section aria-labelledby="stat-h" className="border-b border-border bg-surface">
      <Container className="py-[clamp(3rem,6vw,5rem)]">
        <Reveal>
          <p className="mb-1.5 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-bronze-700">
            {home.statBand.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={60}>
          <h2
            id="stat-h"
            className="mb-9 mt-0 font-display text-[clamp(1.5rem,2.6vw,1.9rem)] font-bold tracking-[-0.01em] text-strong"
          >
            {home.statBand.heading}
          </h2>
        </Reveal>
        <ul
          ref={bandRef}
          className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[2px] overflow-hidden rounded-md border border-border bg-border p-0"
        >
          {stats.map((stat, i) => (
            <li key={stat.id} className="bg-surface px-[22px] py-[26px]">
              <Reveal delay={i * 70}>
                <StatIcon id={stat.id} />
                <StatNumber stat={stat} run={run} />
                <div className="mt-2.5 text-sm leading-[1.4] text-stone-600">
                  {stat.label}
                  {stat.unit ? <span> · {stat.unit}</span> : null}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
