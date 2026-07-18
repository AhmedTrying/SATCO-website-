"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { careersPage } from "@/content/careers";
import { sectors } from "@/content/sectors";
import {
  emptyFilters,
  filterJobs,
  type JobFilterState,
  uniqueValues,
} from "@/lib/jobs";
import type { Job, SectorSlug } from "@/lib/types";
import { Pill } from "@/components/ui/Pill";

/*
 * Job filters + list — locked facets (docx comment #42): keyword, location,
 * operating sector, discipline/function, experience level; live client-side
 * filtering with a result count and an empty state.
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

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const id = useId();
  const [filters, setFilters] = useState<JobFilterState>(emptyFilters);
  const visible = filterJobs(jobs, filters);

  const set = (key: keyof JobFilterState) => (value: string) =>
    setFilters((f) => ({ ...f, [key]: value }));

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
      <form
        aria-label={careersPage.filters.legend}
        className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3.5 rounded-lg border border-border bg-surface p-5"
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

      <p aria-live="polite" className="mb-4 mt-0 text-[13px] text-stone-600">
        Showing {visible.length} of {jobs.length} role{jobs.length === 1 ? "" : "s"}
      </p>

      <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
        {visible.map((job) => (
          <li
            key={job.id}
            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 rounded-lg border border-border bg-surface px-[26px] py-6"
          >
            <div className="flex-[1_1_300px]">
              <h3 className="mb-2.5 mt-0 font-display text-[1.2rem] font-bold text-strong">
                {job.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Pill muted>{job.location}</Pill>
                <Pill muted>{sectorName(job.sector)}</Pill>
                <Pill muted>{levelLabel[job.experienceLevel]}</Pill>
              </div>
            </div>
            <Link
              href={`/careers/${job.slug}`}
              className="inline-flex flex-none items-center gap-[7px] text-[15px] font-semibold text-bronze-800 no-underline transition-[gap] duration-[var(--dur-base)] hover:gap-3 hover:text-bronze-700"
            >
              View role{" "}
              <span aria-hidden="true" className="rtl:-scale-x-100">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <p className="m-0 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-7 text-center text-[15px] text-stone-600">
          {careersPage.roles.emptyMessage}{" "}
          <Link href="/careers#general-application" className="font-semibold text-bronze-800 no-underline hover:underline">
            {careersPage.roles.emptyLinkLabel}
          </Link>
          .
        </p>
      )}
    </>
  );
}
