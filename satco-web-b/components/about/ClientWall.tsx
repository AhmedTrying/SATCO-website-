"use client";

import { useId, useState } from "react";
import { clientsPage } from "@/content/clients";
import type { ImageRef } from "@/lib/types";

/*
 * Option B — FIX-15 "logo wall": one list, every client as an equal tile
 * (logo + name), alphabetical, on a hairline grid. No sector filters, tags or
 * sector count. Clients without a logo file yet show a monogram, so every
 * tile has the same shape. Search (kept from the locked rules: searchable,
 * fast, client-side) filters the tiles live; the count line is aria-live.
 * Logos stay unlinked; no animation beyond hover tints.
 */

export interface WallClient {
  id: string;
  name: string;
  logo?: ImageRef;
}

const MINOR_WORDS = new Set(["of", "the", "for", "and", "&"]);
function monogram(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .split(/\s+/)
    .filter((w) => w && !MINOR_WORDS.has(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function ClientWall({ clients }: { clients: WallClient[] }) {
  const inputId = useId();
  const countId = useId();
  const listId = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? clients.filter((c) => c.name.toLowerCase().includes(q)) : clients;

  return (
    <section aria-label={clientsPage.title}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="relative w-full max-w-[360px]">
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
            className="w-full rounded-sm border border-[#ddd7ca] bg-white py-[13px] pe-4 ps-[42px] font-sans text-[14.5px] text-[#1c1a16] outline-none transition-colors duration-200 placeholder:text-[#6b665c] focus:border-bronze-700"
          />
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8c8578"
            strokeWidth="2"
            className="absolute start-4 top-[15px] rtl:-scale-x-100"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </div>
        <p id={countId} aria-live="polite" className="m-0 text-[13px] tracking-[0.04em] text-[#6b665c]">
          {visible.length}{" "}
          {visible.length === 1
            ? (clientsPage.countLabelSingular ?? clientsPage.countLabel)
            : clientsPage.countLabel}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul
          id={listId}
          className="m-0 grid list-none grid-cols-2 gap-px border border-[#e6e1d6] bg-[#e6e1d6] p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {visible.map((client) => (
            <li key={client.id} className="bg-[#fdfcfa]">
              <div className="group flex h-full min-h-[150px] flex-col items-center justify-center gap-3.5 px-4 py-6 text-center transition-colors duration-[250ms] hover:bg-[#f4f0e7]">
                <div className="flex h-14 w-[120px] items-center justify-center">
                  {client.logo ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized logo asset */
                    <img
                      src={client.logo.src}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-14 w-14 items-center justify-center rounded-full border-[1.5px] border-bronze-200 bg-bronze-50 font-display text-[16px] font-bold tracking-[0.04em] text-bronze-800 transition-colors duration-[250ms] group-hover:border-bronze-400"
                    >
                      {monogram(client.name)}
                    </span>
                  )}
                </div>
                <span className="text-[12.5px] font-medium leading-[1.35] text-[#403c34]">{client.name}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p id={listId} className="m-0 border-t border-[#e6e1d6] pt-6 text-[14px] text-[#6b665c]">
          {clientsPage.emptyMessage}
        </p>
      )}
    </section>
  );
}
