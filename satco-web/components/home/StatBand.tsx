"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { home } from "@/content/home";
import { statPendingNote, stats } from "@/content/stats";
import type { Stat } from "@/lib/types";
import { Container } from "@/components/layout/Container";
import { Reveal } from "@/components/motion/Reveal";

/*
 * The reference groups the published proof points by operating context. The
 * incomplete assets figure stays in the content model, but is not surfaced as
 * a public placeholder in this polished marketing treatment.
 */
const COMMUNITY_STAT_IDS = ["population", "environments", "communities", "assets"];
const AVIATION_STAT_IDS = ["aircrafts", "airports"];

type ProofIcon =
  | "population"
  | "environments"
  | "communities"
  | "assets"
  | "aircrafts"
  | "airports";

// Vertical nudge that centres each drawing in the 64-unit frame, so icons of
// different heights line up across a row.
const centreY: Record<ProofIcon, number> = {
  population: 1.5,
  environments: 0,
  communities: -4.5,
  assets: -3.5,
  aircrafts: 0.5,
  airports: -0.5,
};

function StatIcon({ id }: { id: ProofIcon }) {
  const paths: Record<ProofIcon, React.ReactNode> = {
    population: (
      <>
        <circle cx="32" cy="18" r="7" />
        <circle cx="14" cy="22" r="6" />
        <circle cx="50" cy="22" r="6" />
        <path d="M19 50v-5c0-9 5-15 13-15s13 6 13 15v5H19Z" />
        <path d="M4 50v-4c0-8 4-13 11-13 3 0 5 1 7 3M60 50v-4c0-8-4-13-11-13-3 0-5 1-7 3" />
      </>
    ),
    // Floor-plan square with dimension lines and "m²" drawn as strokes.
    environments: (
      <>
        <path d="M20 8h36v36H20Z" />
        <path d="M11 8v36M8 8h6M8 44h6M20 53h36M20 50v6M56 50v6" />
        <path d="M25 34V23M25 27.5c0-2.8 1.8-4.5 4.25-4.5S33.5 24.7 33.5 27.5V34M33.5 27.5c0-2.8 1.8-4.5 4.25-4.5S42 24.7 42 27.5V34" />
        <path
          strokeWidth="2"
          d="M45 20c.35-1.6 1.55-2.5 3-2.5 1.7 0 3 1.15 3 2.7 0 1.2-.6 2-1.5 2.9L45 25.5h6.2"
        />
      </>
    ),
    // Village: a pitched-roof house in front of two smaller neighbours.
    communities: (
      <>
        <path d="M3 55h58" />
        <path d="M18 32 32 18l14 14M21 29v26M43 29v26M28 55V45h8v10M29 33h6v6h-6Z" />
        <path d="M3 41l9-9 9 9M6 38v17M10.5 44h5v5h-5Z" />
        <path d="M61 41l-9-9-9 9M58 38v17M48.5 44h5v5h-5Z" />
      </>
    ),
    assets: (
      <>
        <path d="M7 55V31h20v24M27 55V16h28v39M55 55h5M3 55h4" />
        <path d="M12 31v-7h10v7M34 24h6M46 24h3M34 33h6M46 33h3M34 42h6M46 42h3M13 39h6M13 47h6" />
      </>
    ),
    // Front-view airliner, echoing the plane in the aviation illustration:
    // tapered fin, long tailplanes, rising wings with winglets.
    aircrafts: (
      <>
        <circle cx="32" cy="35" r="9" />
        <path d="M30.8 26.1 31.5 11.5h1l.7 14.6" />
        <path d="M24 31l-8.5-1.5M40 31l8.5-1.5M26.8 32.5h3.7M33.5 32.5h3.7" />
        <path d="M23.4 37.5 5 33l20.2 7.9M5 33l-1-3M40.6 37.5 59 33l-20.2 7.9M59 33l1-3" />
        <circle cx="15" cy="42" r="3.8" />
        <circle cx="49" cy="42" r="3.8" />
        <path d="M28 43v5M36 43v5" />
        <rect x="26" y="48" width="4" height="3.5" rx="1.2" />
        <rect x="34" y="48" width="4" height="3.5" rx="1.2" />
      </>
    ),
    // Terminal with a vaulted roof beside a control tower.
    airports: (
      <>
        <path d="M4 56h56" />
        <path d="M5 42Q23 31 41 42M8 40.3V56M38 40.3V56M8 46h30M15.5 46v10M23 46v10M30.5 46v10" />
        <path d="M47 56V29M53 56V29M46 29h8l4-8H42l4 8ZM44 21l2-4h8l2 4M50 17V9M47.5 21v8M52.5 21v8" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-14 w-14 shrink-0 text-bronze-700"
    >
      <g transform={`translate(0 ${centreY[id]})`}>{paths[id]}</g>
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
      const timer = window.setTimeout(() => setDisplay(format(target, decimals) + suffix), 0);
      return () => window.clearTimeout(timer);
    }

    const duration = 1600;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(format(target * eased, decimals) + suffix);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setDisplay(format(target, decimals) + suffix);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, stat]);

  if (stat.value === null) {
    return (
      <div className="font-display text-[clamp(2.25rem,3.4vw,3.2rem)] font-bold leading-none text-bronze-700 tabular-nums">
        <span aria-hidden="true">{stat.display}</span>
        <span className="sr-only">{statPendingNote}</span>
      </div>
    );
  }

  const plus = display.endsWith("+");
  return (
    <div className="font-display text-[clamp(2.25rem,3.4vw,3.2rem)] font-bold leading-none tracking-[-0.025em] text-bronze-700 tabular-nums">
      {plus ? display.slice(0, -1) : display}
      {plus ? <span className="align-super text-[0.5em] tracking-normal">+</span> : null}
    </div>
  );
}

function Metric({
  stat,
  run,
  index,
  total,
}: {
  stat: Stat;
  run: boolean;
  index: number;
  total: number;
}) {
  const dividerClass =
    total === 4
      ? [
          "",
          "border-t pt-8 sm:border-t-0 sm:border-s sm:pt-5",
          "border-t pt-8 lg:border-t-0 lg:border-s lg:pt-5",
          "border-t pt-8 sm:border-s lg:border-t-0 lg:pt-5",
        ][index]
      : index > 0
        ? "border-t pt-8 sm:border-t-0 sm:border-s sm:pt-5"
        : "";

  return (
    <li
      className={`flex min-w-0 flex-col items-center border-border px-4 py-5 text-center sm:px-5 ${dividerClass}`}
    >
      <StatIcon id={stat.id as ProofIcon} />
      <div className="mt-5">
        <StatNumber stat={stat} run={run} />
      </div>
      <p className="mb-0 mt-3 max-w-[20ch] text-[15px] font-medium leading-[1.45] text-strong">
        {stat.label}
      </p>
    </li>
  );
}

function ProofCard({
  id,
  title,
  illustrationSrc,
  metrics,
  run,
  delay,
}: {
  id: string;
  title: string;
  illustrationSrc: string;
  metrics: Stat[];
  run: boolean;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        aria-labelledby={id}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-bronze-200 bg-[linear-gradient(145deg,var(--surface)_0%,var(--stone-50)_100%)]"
      >
        <div className="px-[clamp(1.5rem,3vw,2.75rem)] pt-[clamp(1.75rem,3vw,2.75rem)]">
          <h3
            id={id}
            className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-bronze-700"
          >
            {title}
          </h3>
          <div aria-hidden="true" className="mt-4 h-px w-12 bg-bronze-700" />
        </div>

        <div className="relative mx-auto h-[clamp(9rem,13vw,12rem)] w-full overflow-hidden">
          <Image
            src={illustrationSrc}
            alt=""
            fill
            sizes="(min-width: 1280px) 48vw, 100vw"
            className="object-cover object-center mix-blend-multiply"
          />
        </div>

        <ul
          className={`m-0 grid list-none content-start border-t border-bronze-100 px-[clamp(1rem,2vw,2rem)] pb-[clamp(1.3rem,2.5vw,2.4rem)] pt-4 ${
            metrics.length === 4
              ? "sm:grid-cols-2 lg:grid-cols-4"
              : metrics.length === 3
                ? "sm:grid-cols-3"
                : "sm:grid-cols-2"
          }`}
        >
          {metrics.map((stat, index) => (
            <Metric
              key={stat.id}
              stat={stat}
              run={run}
              index={index}
              total={metrics.length}
            />
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

export function StatBand() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);
  const statMap = useMemo(() => new Map(stats.map((stat) => [stat.id, stat])), []);
  const communityStats = COMMUNITY_STAT_IDS.flatMap((id) => {
    const stat = statMap.get(id);
    return stat ? [stat] : [];
  });
  const aviationStats = AVIATION_STAT_IDS.flatMap((id) => {
    const stat = statMap.get(id);
    return stat ? [stat] : [];
  });

  useEffect(() => {
    const element = cardsRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRun(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section aria-labelledby="stat-h" className="border-b border-border bg-bg">
      <Container className="py-[clamp(4rem,7vw,7rem)]">
        <div className="max-w-[78rem]">
          <Reveal>
            <div aria-hidden="true" className="mb-5 h-[3px] w-12 rounded-full bg-bronze-700" />
          </Reveal>
          <Reveal delay={40}>
            <p className="mb-2 mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.2em] text-bronze-700">
              {home.statBand.eyebrow}
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2
              id="stat-h"
              className="my-0 max-w-[30ch] font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold leading-[1.12] tracking-[-0.015em] text-strong"
            >
              {home.statBand.heading}
            </h2>
          </Reveal>
          {home.statBand.lede ? (
            <Reveal delay={120}>
              <p className="mb-0 mt-4 max-w-[76ch] text-[clamp(1rem,1.4vw,1.1rem)] leading-[1.7] text-stone-600">
                {home.statBand.lede}
              </p>
            </Reveal>
          ) : null}
        </div>

        <div
          ref={cardsRef}
          className="mt-[clamp(2.5rem,4vw,3.5rem)] grid items-stretch gap-5 xl:grid-cols-[1.12fr_1fr]"
        >
          <ProofCard
            id="communities-proof"
            title={home.statBand.groups.communities}
            illustrationSrc="/images/proven-communities.png"
            metrics={communityStats}
            run={run}
            delay={140}
          />
          <ProofCard
            id="aviation-proof"
            title={home.statBand.groups.aviation}
            illustrationSrc="/images/proven-aviation.png"
            metrics={aviationStats}
            run={run}
            delay={210}
          />
        </div>
      </Container>
    </section>
  );
}
