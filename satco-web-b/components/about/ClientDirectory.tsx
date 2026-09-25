"use client";

import { useId, useMemo, useState } from "react";
import { clientsPage } from "@/content/clients";
import { cn } from "@/lib/utils";

/*
 * Full Client List — 4A design: header row (eyebrow + h2 | search field),
 * sector filter chips, live result count, and an alphabetically grouped
 * directory with letter markers and sector tags. Locked rules kept (docx
 * comment #31): searchable, text-only, fast client-side filtering, unlimited
 * length. Sector + search compose (AND); empty letter groups disappear.
 *
 * A11y (site AA invariant): chips are a labelled group with aria-pressed;
 * the count line is aria-live; the search input has a (visually hidden)
 * label. Small-text grays from the 4A palette (#9a9384 / #b3ab99) fail
 * 4.5:1 on this canvas, so captions/tags/count render in #6b665c — the
 * design's own "Muted" — instead.
 */

export interface DirectoryClient {
  name: string;
  sectorTag?: string;
}

/** 4A chip order; tags outside the known taxonomy append alphabetically. */
const TAG_ORDER = [
  "Aviation",
  "Infrastructure",
  "Energy & utilities",
  "Government",
  "Development",
];

export function ClientDirectory({ clients }: { clients: DirectoryClient[] }) {
  const inputId = useId();
  const countId = useId();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string | null>(null); // null = All

  const sorted = useMemo(
    () => [...clients].sort((a, b) => a.name.localeCompare(b.name)),
    [clients],
  );
  const tags = useMemo(() => {
    const present = [...new Set(sorted.map((c) => c.sectorTag).filter(Boolean))] as string[];
    return present.sort((a, b) => {
      const ia = TAG_ORDER.indexOf(a);
      const ib = TAG_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [sorted]);

  const q = query.trim().toLowerCase();
  const visible = sorted.filter(
    (c) =>
      (!sector || c.sectorTag === sector) &&
      (!q || c.name.toLowerCase().includes(q)),
  );
  const groups = useMemo(() => {
    const byLetter = new Map<string, DirectoryClient[]>();
    for (const c of visible) {
      const letter = c.name[0]?.toUpperCase() ?? "#";
      const list = byLetter.get(letter) ?? [];
      list.push(c);
      byLetter.set(letter, list);
    }
    return [...byLetter.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({ letter, items }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- derived from visible
  }, [sorted, sector, q]);

  const chipBase =
    "cursor-pointer px-[18px] py-[9px] font-sans text-[13.5px] font-medium transition-[color,background-color,border-color] duration-200";

  return (
    <section aria-labelledby="full-clients-h">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
        <div>
          {clientsPage.directoryEyebrow ? (
            <p className="mb-3.5 mt-0 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#8a6a1f]">
              {clientsPage.directoryEyebrow}
            </p>
          ) : null}
          <h2
            id="full-clients-h"
            className="my-0 font-expanded text-[clamp(1.5rem,2.4vw,2.125rem)] font-semibold leading-[1.15] text-[#1c1a16]"
          >
            {clientsPage.directoryHeading}
          </h2>
        </div>
        <div className="relative w-full max-w-[320px]">
          <label htmlFor={inputId} className="sr-only">
            {clientsPage.searchLabel}
          </label>
          <input
            id={inputId}
            type="search"
            placeholder={clientsPage.searchLabel}
            aria-controls={listId}
            aria-describedby={countId}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-[#ddd7ca] bg-white py-[13px] pe-4 ps-[42px] font-sans text-[14.5px] text-[#1c1a16] outline-none transition-colors duration-200 placeholder:text-[#6b665c] focus:border-[#8a6a1f]"
          />
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9a9384"
            strokeWidth="2"
            className="absolute start-4 top-[15px] rtl:-scale-x-100"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </div>
      </div>

      <div role="group" aria-label="Filter by sector" className="mb-5 flex flex-wrap gap-2">
        {[null, ...tags].map((tag) => {
          const active = sector === tag;
          const label = tag ?? clientsPage.allChipLabel ?? "All";
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => setSector(tag)}
              className={cn(
                chipBase,
                active
                  ? "border border-[#1c1a16] bg-[#1c1a16] text-[#fdfcfa]"
                  : "border border-[#ddd7ca] bg-transparent text-[#6b665c] hover:border-[#8a6a1f] hover:text-[#8a6a1f]",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p
        id={countId}
        aria-live="polite"
        className="mb-9 mt-0 text-[13px] tracking-[0.04em] text-[#6b665c]"
      >
        {visible.length}{" "}
        {visible.length === 1
          ? (clientsPage.countLabelSingular ?? clientsPage.countLabel ?? "client")
          : (clientsPage.countLabel ?? "clients")}
      </p>

      <div id={listId} className="flex flex-col gap-9">
        {groups.map((group) => (
          <div
            key={group.letter}
            className="grid grid-cols-[40px_1fr] items-start gap-4 sm:grid-cols-[64px_1fr] sm:gap-6"
          >
            <div
              aria-hidden="true"
              className="pt-3 font-expanded text-[26px] font-bold leading-none text-[#ddd7ca]"
            >
              {group.letter}
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-x-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((client) => (
                <li
                  key={client.name}
                  className="flex items-baseline justify-between gap-3 border-t border-[#eee9de] px-1 py-3 transition-colors duration-200 hover:border-t-[#8a6a1f]"
                >
                  <span className="text-[14.5px] leading-[1.4] text-[#403c34]">
                    {client.name}
                  </span>
                  {client.sectorTag ? (
                    <span className="whitespace-nowrap text-[10.5px] uppercase tracking-[0.06em] text-[#6b665c]">
                      {client.sectorTag}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="m-0 text-[13px] tracking-[0.04em] text-[#6b665c]">
            {clientsPage.emptyMessage}
          </p>
        )}
      </div>
    </section>
  );
}
