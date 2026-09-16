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
    environments: (
      <>
        <path d="M9 54V29h18v25M27 54V12h24v42M51 54V32h8v22M4 54h56" />
        <path d="M15 36h5M15 43h5M34 20h5M43 20h2M34 29h5M43 29h2M34 38h5M43 38h2M34 47h5M43 47h2" />
      </>
    ),
    communities: (
      <>
        <circle cx="32" cy="32" r="25" />
        <path d="M7 32h50M32 7c8 8 12 16 12 25S40 49 32 57M32 7c-8 8-12 16-12 25s4 17 12 25M13 17c6 4 12 6 19 6s13-2 19-6M13 47c6-4 12-6 19-6s13 2 19 6" />
      </>
    ),
    assets: (
      <>
        <path d="M7 55V31h20v24M27 55V16h28v39M55 55h5M3 55h4" />
        <path d="M12 31v-7h10v7M34 24h6M46 24h3M34 33h6M46 33h3M34 42h6M46 42h3M13 39h6M13 47h6" />
      </>
    ),
    aircrafts: (
      <g transform="translate(2 2) scale(2.45)">
        <path d="m6.36 17.4-2.36-.4-2-4 1.1-.55a2 2 0 0 1 1.8.02l2.86 1.43 4.73-2.37-3.32-5.18 1.25-.63a2 2 0 0 1 2.58.66l4 4 2.08-1.04a2.5 2.5 0 0 1 2.66 4.23L12 18.43a2 2 0 0 1-1.8.04Z" />
      </g>
    ),
    airports: (
      <>
        <path d="M18 18h28l-5 20H23L18 18ZM25 38v17M39 38v17M18 55h28M32 18V8M26 8h12" />
        <path d="M23 18v-7h18v7" />
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
      {paths[id]}
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
