"use client";

import { useId, useRef, useState } from "react";
import { officeLabels, offices, type Office } from "@/content/offices";

/*
 * Office locator for the contact page (FIX-33) — the same file in Options A,
 * B and C.
 *
 * SATCO has two offices (Riyadh head office, Al Jubail). Stacking the
 * cards would make this column far taller than the form again, which is what
 * FIX-30 set out to fix, so the offices share one panel behind a tab strip:
 * the map stays at the top of the column and the panel still stretches to the
 * form's height.
 *
 * ARIA: one tablist over a single reused tabpanel (aria-labelledby follows the
 * selection). All detail blocks are stacked in the same grid cell so the
 * panel's height never changes between tabs; the inactive ones use
 * visibility:hidden, which keeps them out of the tab order and the a11y tree.
 */

const detailLabel =
  "text-[11.5px] font-semibold uppercase tracking-[0.08em] text-bronze-300";

const darkLink =
  "text-[15px] font-medium text-white no-underline transition-colors duration-[var(--dur-fast)] hover:text-bronze-200 hover:underline";

/** Decorative line icon for a details row (labels carry the meaning). */
export function DetailIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 flex-none text-bronze-300"
    >
      {children}
    </svg>
  );
}

/** Map slot: the live embed, or the designed placeholder for a pending office. */
export function MapSurface({ office }: { office: Office }) {
  if (office.mapEmbedUrl) {
    /* Keyless Google embed; the title carries the accessible name. No scrim
       over it — Google's attribution has to stay legible. */
    return (
      <iframe
        key={office.id}
        src={office.mapEmbedUrl}
        title={office.mapLabel}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 block h-full w-full border-0 bg-sand"
      />
    );
  }
  /* Placeholder — a designed block (grid + crosshair + pin), used when no embed
     URL is published (plan §12 Q6). Children are presentational under
     role="img"; the aria-label carries the meaning. */
  return (
    <div
      role="img"
      aria-label={office.mapLabel}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-sand"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(var(--stone-200)_1px,transparent_1px),linear-gradient(90deg,var(--stone-200)_1px,transparent_1px)] opacity-70 [background-size:26px_26px]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-bronze-300/60" />
      <div aria-hidden="true" className="absolute inset-y-0 start-1/2 w-px bg-bronze-300/60" />
      <div aria-hidden="true" className="relative flex h-[76px] w-[76px] items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-bronze-400/35 motion-safe:animate-pulse" />
        <span className="absolute inset-[15px] rounded-full border border-bronze-400/60" />
        <span className="h-4 w-4 -rotate-45 rounded-[50%_50%_50%_0] bg-bronze-800 shadow-sm rtl:rotate-45 rtl:rounded-[50%_50%_0_50%]" />
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <span className="rounded-sm border border-border bg-surface/90 px-2.5 py-1 font-mono text-[11.5px] tracking-[0.04em] text-stone-600">
          {office.mapCaption}
        </span>
      </div>
    </div>
  );
}

/** Same derivation as the footer's "Get directions": drop the embed flag. */
export function directionsHref(office: Office) {
  return office.mapEmbedUrl
    ? office.mapEmbedUrl.replace("&output=embed", "").replace("?output=embed", "")
    : null;
}

export function OfficeDetails({ office }: { office: Office }) {
  const directions = directionsHref(office);
  const hasPhone = Boolean(office.phone);
  return (
    <div className="@container p-6">
      <ul className="m-0 flex list-none flex-col divide-y divide-white/10 p-0">
        <li className="flex gap-4 py-3 first:pt-0 last:pb-0">
          <DetailIcon>
            <path d="M20.5 10.2c0 6.6-8.5 12.3-8.5 12.3S3.5 16.8 3.5 10.2a8.5 8.5 0 0 1 17 0z" />
            <circle cx="12" cy="10.2" r="2.8" />
          </DetailIcon>
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className={detailLabel}>{office.name}</span>
              {office.pendingNote && (
                /* Same "awaiting the client" treatment as the certifications page */
                <span className="rounded-sm border border-white/20 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.06em] text-stone-300">
                  {officeLabels.pending}
                </span>
              )}
            </div>
            {office.addressLines ? (
              <div className="text-[15px] leading-[1.55] text-stone-200">
                {office.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </div>
            ) : (
              <p className="m-0 text-[15px] leading-[1.55] text-stone-400">{office.pendingNote}</p>
            )}
            {office.shortAddress && (
              /* Saudi National Address short code — verifiable, so it earns its place */
              <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                <span className="text-[11px] uppercase tracking-[0.08em] text-stone-400">
                  {officeLabels.shortAddress}
                </span>
                <span className="font-mono text-[13px] tracking-[0.08em] text-stone-200">
                  {office.shortAddress}
                </span>
              </div>
            )}
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-bronze-300 no-underline transition-colors duration-[var(--dur-fast)] hover:text-white hover:underline"
              >
                {officeLabels.directions}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </li>
        {/* Phone and email share a row when both exist and the card is wide
            enough for them (container query, not viewport). */}
        <li
          className={`grid grid-cols-1 gap-x-5 gap-y-3 py-3 first:pt-0 last:pb-0 ${
            hasPhone ? "@md:grid-cols-2" : ""
          }`}
        >
          {office.phone && (
            <div className="flex min-w-0 gap-4">
              <DetailIcon>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </DetailIcon>
              <div className="min-w-0">
                <div className={`mb-1 ${detailLabel}`}>{officeLabels.phone}</div>
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className={darkLink}>
                  {office.phone}
                </a>
                {office.fax && (
                  /* Reference text, as on the letterhead — a fax line is not dialled */
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                    <span className="text-[11px] uppercase tracking-[0.08em] text-stone-400">
                      {officeLabels.fax}
                    </span>
                    <span className="text-[13px] text-stone-200">{office.fax}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div
            className={`flex min-w-0 gap-4 ${
              hasPhone ? "@md:border-s @md:border-white/10 @md:ps-5" : ""
            }`}
          >
            <DetailIcon>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7.5 8 5.5 8-5.5" />
            </DetailIcon>
            <div className="min-w-0">
              <div className={`mb-1 ${detailLabel}`}>{officeLabels.email}</div>
              <a href={`mailto:${office.email}`} className={`${darkLink} block break-words`}>
                {office.email}
              </a>
            </div>
          </div>
        </li>
        {office.hours && (
          <li className="flex gap-4 py-3 first:pt-0 last:pb-0">
            <DetailIcon>
              <circle cx="12" cy="12" r="8.6" />
              <path d="M12 7.2V12l3.1 2" />
            </DetailIcon>
            <div>
              <div className={`mb-1 ${detailLabel}`}>{officeLabels.hours}</div>
              <div className="text-[15px] text-stone-200">{office.hours}</div>
            </div>
          </li>
        )}
      </ul>
    </div>
  );
}

export function OfficeLocator({ heading }: { heading: string }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = `${baseId}-panel`;
  const tabId = (i: number) => `${baseId}-tab-${offices[i].id}`;

  const select = (i: number) => {
    const next = (i + offices.length) % offices.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Arrow keys follow the writing direction, so this survives the RTL flip
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const step = rtl ? -1 : 1;
    if (e.key === "ArrowRight") select(active + step);
    else if (e.key === "ArrowLeft") select(active - step);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(offices.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="on-dark flex h-full flex-col overflow-hidden rounded-lg bg-stone-950 shadow-md">
      <h2 className="sr-only">{heading}</h2>
      <div
        role="tablist"
        aria-label={heading}
        onKeyDown={onKeyDown}
        className="flex flex-none gap-1 border-b border-white/10 px-3 pt-3"
      >
        {offices.map((o, i) => {
          const selected = i === active;
          return (
            <button
              key={o.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={tabId(i)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative flex-1 cursor-pointer rounded-t-sm border-none bg-transparent px-2 pb-2.5 pt-1.5 font-display text-[13.5px] font-semibold transition-colors duration-[var(--dur-fast)] ${
                selected ? "text-white" : "text-stone-400 hover:text-stone-200"
              }`}
            >
              {o.city}
              <span
                aria-hidden="true"
                className={`absolute inset-x-1 -bottom-px h-[2px] rounded-full transition-colors duration-[var(--dur-fast)] ${
                  selected ? "bg-bronze-400" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="relative h-[260px] w-full flex-none lg:h-auto lg:min-h-[180px] lg:flex-1">
          <MapSurface office={offices[active]} />
        </div>
        {/* Bronze rule, echoing the form card's accent across the columns */}
        <div
          aria-hidden="true"
          className="h-[3px] flex-none bg-[linear-gradient(90deg,var(--bronze-800),var(--bronze-400))] rtl:bg-[linear-gradient(270deg,var(--bronze-800),var(--bronze-400))]"
        />
        {/* All offices stacked in one cell: the panel keeps one height for every tab */}
        <div className="grid flex-none">
          {offices.map((o, i) => (
            <div
              key={o.id}
              className={`[grid-area:1/1] ${i === active ? "" : "invisible"}`}
            >
              <OfficeDetails office={o} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
