"use client";

import { useId, useState } from "react";
import { Container } from "@/components/layout/Container";
import { clientsPage } from "@/content/clients";
import type { ImageRef } from "@/lib/types";

/*
 * Option C — FIX-15 "A–Z index": one list, every client as logo + name,
 * grouped by initial letter. A dark charcoal hero (C's palette) carries the
 * title, the client count and the search; below, a sticky A–Z bar jumps to
 * each letter (letters with no client are shown dimmed, not linked) and each
 * group lists its clients as rows with a small logo plate. No sector filters,
 * tags or sector count. Clients without a logo file show a monogram plate.
 * Unlinked; the count is aria-live; search filters groups and the bar.
 */

export interface IndexClient {
  id: string;
  name: string;
  logo?: ImageRef;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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
const letterOf = (name: string) => {
  const l = name.trim()[0]?.toUpperCase() ?? "#";
  return LETTERS.includes(l) ? l : "#";
};

export function ClientIndex({ clients }: { clients: IndexClient[] }) {
  const inputId = useId();
  const countId = useId();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const visible = q ? clients.filter((c) => c.name.toLowerCase().includes(q)) : clients;

  const groups = new Map<string, IndexClient[]>();
  for (const c of visible) {
    const l = letterOf(c.name);
    groups.set(l, [...(groups.get(l) ?? []), c]);
  }
  const ordered = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
  const anchor = (l: string) => `clients-${l === "#" ? "other" : l.toLowerCase()}`;

  return (
    <>
      <div className="on-dark relative isolate overflow-hidden bg-[#181512] text-stone-200">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_70%_at_100%_0%,rgb(209_138_32/0.16),transparent_70%)] rtl:bg-[radial-gradient(55%_70%_at_0%_0%,rgb(209_138_32/0.16),transparent_70%)]"
        />
        <Container className="pb-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.75rem,5.5vw,4.5rem)]">
          <div className="grid items-end gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h1
                id="clients-h"
                className="m-0 font-display text-[clamp(2.75rem,5.5vw,4.5rem)] font-bold leading-[1] tracking-[-0.03em] text-white"
              >
                {clientsPage.title}
              </h1>
              <div aria-hidden="true" className="mb-5 mt-6 h-[3px] w-14 bg-bronze-400" />
              <p className="m-0 max-w-[56ch] text-[clamp(1.02rem,1.5vw,1.15rem)] leading-[1.65] text-stone-300">
                {clientsPage.subline}
              </p>
            </div>
            {/* Derived count — never stored, so it can't drift */}
            <div className="md:text-end">
              <div className="font-display text-[clamp(3.25rem,6vw,5rem)] font-bold leading-none tracking-[-0.03em] text-bronze-300 tabular-nums">
                {clients.length}
              </div>
              <div className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-stone-400">
                {clientsPage.statClientsLabel}
              </div>
            </div>
          </div>

          <div className="mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/12 pt-6">
            <div className="relative w-full max-w-[420px]">
              <label htmlFor={inputId} className="sr-only">
                {clientsPage.searchLabel}
              </label>
              <input
                id={inputId}
                type="search"
                placeholder={clientsPage.searchLabel}
                aria-describedby={countId}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full border border-white/20 bg-white/8 py-3 pe-5 ps-11 font-sans text-[14.5px] text-white outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-bronze-300 focus:bg-white/12"
              />
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute start-4 top-1/2 -translate-y-1/2 text-stone-400 rtl:-scale-x-100"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </div>
            <p id={countId} aria-live="polite" className="m-0 text-[13px] tracking-[0.04em] text-stone-400">
              {visible.length}{" "}
              {visible.length === 1
                ? (clientsPage.countLabelSingular ?? clientsPage.countLabel)
                : clientsPage.countLabel}
            </p>
          </div>
        </Container>
      </div>

      {/* Sticky A–Z bar */}
      <nav
        aria-label="Clients A–Z"
        className="sticky top-[var(--nav-h)] z-10 border-b border-[#e6e1d6] bg-[#fdfcfa]/92 backdrop-blur-md"
      >
        <Container>
          <ul className="m-0 flex list-none gap-0.5 overflow-x-auto p-0 py-2.5 [scrollbar-width:none]">
            {LETTERS.map((l) => {
              const has = groups.has(l);
              return (
                <li key={l} className="flex-none">
                  {has ? (
                    <a
                      href={`#${anchor(l)}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full font-display text-[13px] font-semibold text-[#1c1a16] no-underline transition-colors hover:bg-bronze-800 hover:text-white"
                    >
                      {l}
                    </a>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center font-display text-[13px] text-[#c8c1b2]"
                    >
                      {l}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </Container>
      </nav>

      <Container className="py-[clamp(2.5rem,5vw,4rem)]">
        {ordered.length === 0 ? (
          <p className="m-0 text-[14px] text-[#6b665c]">{clientsPage.emptyMessage}</p>
        ) : (
          <div className="flex flex-col">
            {ordered.map(([letter, items]) => (
              <section
                key={letter}
                id={anchor(letter)}
                aria-labelledby={`${anchor(letter)}-h`}
                className="grid scroll-mt-[calc(var(--nav-h)+4rem)] grid-cols-[48px_1fr] gap-x-4 border-t border-[#e6e1d6] py-7 first:border-t-0 first:pt-0 sm:grid-cols-[96px_1fr] sm:gap-x-8"
              >
                <h2
                  id={`${anchor(letter)}-h`}
                  className="m-0 font-expanded text-[clamp(2rem,4vw,3rem)] font-semibold leading-none text-bronze-700"
                >
                  {letter}
                </h2>
                <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((client) => (
                    <li
                      key={client.id}
                      className="flex items-center gap-4 rounded-md border border-[#ebe6db] bg-white px-3 py-2.5 transition-colors duration-200 hover:border-bronze-300"
                    >
                      <span className="flex h-12 w-[76px] flex-none items-center justify-center rounded-sm bg-[#faf8f3]">
                        {client.logo ? (
                          /* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized logo asset */
                          <img
                            src={client.logo.src}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="max-h-9 max-w-[64px] object-contain"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="font-display text-[14px] font-bold tracking-[0.06em] text-[#8c8578]"
                          >
                            {monogram(client.name)}
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 text-[14.5px] leading-[1.35] text-[#2b2822]">{client.name}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
