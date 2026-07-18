"use client";

import { useId, useMemo, useState } from "react";
import { clientsPage } from "@/content/clients";

/*
 * Full Client List — locked spec (docx comment #31): searchable, text-only A–Z,
 * fast client-side filtering, 2 columns desktop / 1 mobile, no bullets,
 * unlimited length. Result counts are announced via aria-live.
 */
export function ClientDirectory({ names }: { names: string[] }) {
  const inputId = useId();
  const countId = useId();
  const listId = useId();
  const [query, setQuery] = useState("");

  const sorted = useMemo(() => [...names].sort((a, b) => a.localeCompare(b)), [names]);
  const q = query.trim().toLowerCase();
  const visible = q ? sorted.filter((n) => n.toLowerCase().includes(q)) : sorted;

  return (
    <section aria-labelledby="full-clients-h" className="mb-[clamp(3rem,5vw,4rem)]">
      <h2
        id="full-clients-h"
        className="mb-5 mt-0 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-bold text-strong"
      >
        {clientsPage.directoryHeading}
      </h2>
      <div className="mb-3 max-w-[440px]">
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-strong">
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
          className="w-full rounded-sm border border-stone-500 bg-surface px-3.5 py-3 text-[15px] text-strong focus:border-bronze-800"
        />
      </div>
      <p id={countId} aria-live="polite" className="mb-[18px] mt-0 min-h-5 text-[13px] text-stone-600">
        {query.trim()
          ? `${visible.length} of ${sorted.length} clients match "${query.trim()}"`
          : `${sorted.length} clients`}
      </p>
      {/* Locked: 2 columns desktop / 1 mobile (comment #31 — overrides the
          design prototype's auto column count) */}
      <ul id={listId} className="m-0 list-none columns-1 gap-11 p-0 md:columns-2">
        {visible.map((name) => (
          <li
            key={name}
            className="border-b border-stone-100 py-[9px] text-[15px] text-stone-700 [break-inside:avoid]"
          >
            {name}
          </li>
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="mb-0 mt-2 rounded-[10px] border border-dashed border-stone-300 bg-stone-50 p-[22px] text-center text-[14.5px] text-stone-600">
          {clientsPage.emptyMessage}
        </p>
      )}
    </section>
  );
}
