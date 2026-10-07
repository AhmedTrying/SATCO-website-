"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { careersPage } from "@/content/careers";
import { jobApplicationCopy } from "@/content/job-application";
import { sectors } from "@/content/sectors";
import {
  emptyFilters,
  filterJobs,
  type JobFilterState,
  uniqueValues,
} from "@/lib/jobs";
import type { Job, SectorSlug } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/ui/Pill";
import { useLiveJobs } from "@/components/careers/useLiveJobs";

/*
 * Job filters + list — locked facets (docx comment #42): keyword, location,
 * operating sector, discipline/function, experience level; live client-side
 * filtering with a result count and an empty state.
 *
 * Reveals wrap the form and the results region once (not per row), so
 * filtering never re-triggers entrance animation — the list stays snappy.
 */

const sectorName = (slug: SectorSlug) =>
  sectors.find((s) => s.slug === slug)?.name ?? slug;

const levelLabel: Record<Job["experienceLevel"], string> = {
  entry: "Entry",
  mid: "Mid",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

const fieldClass =
  "w-full rounded-sm border border-stone-500 bg-surface px-3 py-[11px] text-[14.5px] text-strong focus:border-bronze-800";
const labelClass = "text-[13px] font-semibold text-strong";

/*
 * Option C (docs/VARIANTS.md): the matching roles are split into numbered pages
 * of PAGE_SIZE with Previous / 1 2 3 / Next controls under the list. Changing a
 * filter returns to page 1; if the live feed shrinks, the page clamps to the
 * last one. A page change scrolls back to the top of the results (under the
 * sticky header) and moves focus to the result count, which also announces it.
 */
const PAGE_SIZE = 10;

const pageButtonClass =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-sm border px-3 text-[14.5px] font-semibold transition-colors duration-[var(--dur-base)] disabled:cursor-default disabled:opacity-40";

export function JobBoard({ jobs: initialJobs }: { jobs: Job[] }) {
  const id = useId();
  const { jobs, status } = useLiveJobs(initialJobs);
  const [filters, setFilters] = useState<JobFilterState>(emptyFilters);
  const [page, setPage] = useState(1);
  const countRef = useRef<HTMLParagraphElement>(null);
  const pendingScroll = useRef(false);
  const visible = filterJobs(jobs, filters);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const listed = visible.slice(start, start + PAGE_SIZE);
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  const set = (key: keyof JobFilterState) => (value: string) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const goTo = (next: number) => {
    pendingScroll.current = true;
    setPage(Math.min(Math.max(1, next), pageCount));
  };

  // After a page change: bring the results back under the sticky header and
  // put focus on the (aria-live) count so the new page is announced.
  useEffect(() => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    const el = countRef.current;
    if (!el) return;
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 72;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 24;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    el.focus({ preventScroll: true });
  }, [current]);

  const selects: Array<{
    key: keyof JobFilterState;
    label: string;
    all: string;
    options: Array<{ value: string; label: string }>;
  }> = [
    {
      key: "location",
      label: careersPage.filters.location,
      all: "All locations",
      options: uniqueValues(jobs, "location").map((l) => ({ value: l, label: l })),
    },
    {
      key: "sector",
      label: careersPage.filters.sector,
      all: "All sectors",
      options: sectors.map((s) => ({ value: s.slug, label: s.name })),
    },
    {
      key: "discipline",
      label: careersPage.filters.discipline,
      all: "All disciplines",
      options: uniqueValues(jobs, "discipline").map((d) => ({ value: d, label: d })),
    },
    {
      key: "level",
      label: careersPage.filters.level,
      all: "All levels",
      options: uniqueValues(jobs, "experienceLevel").map((l) => ({
        value: l,
        label: levelLabel[l],
      })),
    },
  ];

  return (
    <>
      <Reveal>
        <form
          aria-label={careersPage.filters.legend}
          className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5 rounded-lg border border-border bg-surface p-5 shadow-xs"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${id}-kw`} className={labelClass}>
              {careersPage.filters.keyword}
            </label>
            <input
              id={`${id}-kw`}
              type="text"
              placeholder={careersPage.filters.keywordPlaceholder}
              value={filters.keyword}
              onChange={(e) => set("keyword")(e.target.value)}
              className={fieldClass}
            />
          </div>
          {selects.map((select) => (
            <div key={select.key} className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-${select.key}`} className={labelClass}>
                {select.label}
              </label>
              <select
                id={`${id}-${select.key}`}
                value={filters[select.key]}
                onChange={(e) => set(select.key)(e.target.value)}
                className={fieldClass}
              >
                <option value="">{select.all}</option>
                {select.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </form>
      </Reveal>

      <Reveal delay={80}>
        {status === "error" && (
          <p role="status" className="mb-4 text-sm text-stone-700">
            {jobApplicationCopy.jobsUnavailable}
          </p>
        )}
        <p
          ref={countRef}
          tabIndex={-1}
          aria-live="polite"
          className="mb-4 mt-0 text-[13px] text-stone-600 outline-none"
        >
          {visible.length === 0
            ? `Showing 0 of ${jobs.length} role${jobs.length === 1 ? "" : "s"}`
            : `Showing ${start + 1}–${start + listed.length} of ${visible.length} role${visible.length === 1 ? "" : "s"}`}
        </p>

        <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
          {listed.map((job) => (
            <li
              key={job.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-surface transition-[translate,border-color,box-shadow] duration-[var(--dur-slow)] ease-[var(--ease-standard)] focus-within:border-bronze-300 hover:-translate-y-1 hover:border-bronze-300 hover:shadow-md"
            >
              {/* Bronze accent draws in when the card is hovered or focused */}
              <span
                aria-hidden="true"
                className="absolute inset-y-0 start-0 w-[3px] bg-bronze-700 opacity-0 transition-opacity duration-[var(--dur-slow)] group-focus-within:opacity-100 group-hover:opacity-100"
              />
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-[26px] py-6">
                <div className="flex-[1_1_300px]">
                  <h3 className="mb-2.5 mt-0 font-display text-[1.2rem] font-bold text-strong transition-colors duration-[var(--dur-base)] group-hover:text-bronze-800">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Pill muted>{job.location}</Pill>
                    <Pill muted>{sectorName(job.sector)}</Pill>
                    <Pill muted>{levelLabel[job.experienceLevel]}</Pill>
                  </div>
                </div>
                <Link
                  href={`/careers/role?slug=${encodeURIComponent(job.slug)}`}
                  className="inline-flex flex-none items-center gap-[7px] text-[15px] font-semibold text-bronze-800 no-underline transition-[gap] duration-[var(--dur-base)] group-hover:gap-3 hover:gap-3 hover:text-bronze-700"
                >
                  View role{" "}
                  <span aria-hidden="true" className="rtl:-scale-x-100">
                    →
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        {pageCount > 1 && (
          <nav aria-label={careersPage.roles.pagination.label} className="mt-7">
            <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-2 p-0">
              <li>
                <button
                  type="button"
                  onClick={() => goTo(current - 1)}
                  disabled={current === 1}
                  className={`${pageButtonClass} border-stone-400 bg-transparent text-stone-800 hover:border-bronze-700 hover:text-bronze-800`}
                >
                  <span aria-hidden="true" className="rtl:-scale-x-100">←</span>{" "}
                  {careersPage.roles.pagination.previous}
                </button>
              </li>
              {pages.map((n) => (
                <li key={n}>
                  <button
                    type="button"
                    onClick={() => goTo(n)}
                    aria-current={n === current ? "page" : undefined}
                    aria-label={`${careersPage.roles.pagination.page} ${n}`}
                    className={`${pageButtonClass} ${
                      n === current
                        ? "border-bronze-800 bg-bronze-800 text-white"
                        : "border-stone-400 bg-transparent text-stone-800 hover:border-bronze-700 hover:text-bronze-800"
                    }`}
                  >
                    {n}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => goTo(current + 1)}
                  disabled={current === pageCount}
                  className={`${pageButtonClass} border-stone-400 bg-transparent text-stone-800 hover:border-bronze-700 hover:text-bronze-800`}
                >
                  {careersPage.roles.pagination.next}{" "}
                  <span aria-hidden="true" className="rtl:-scale-x-100">→</span>
                </button>
              </li>
            </ul>
          </nav>
        )}

        {visible.length === 0 && (
          <p className="m-0 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-7 text-center text-[15px] text-stone-600">
            {careersPage.roles.emptyMessage}{" "}
            <Link href="/careers#general-application" className="font-semibold text-bronze-800 no-underline hover:underline">
              {careersPage.roles.emptyLinkLabel}
            </Link>
            .
          </p>
        )}
      </Reveal>
    </>
  );
}
