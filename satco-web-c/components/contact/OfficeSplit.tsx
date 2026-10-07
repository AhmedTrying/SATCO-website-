"use client";

import { useId, useRef, useState } from "react";
import { officeLabels, offices, type Office } from "@/content/offices";
import { MapSurface, directionsHref } from "@/components/contact/OfficeLocator";

/*
 * Option C — contact "split screen" (FIX-30 / FIX-33).
 *
 * The form sits on the left half, aligned to the site container; the right
 * half is the live map, edge to edge to the window and the full height of the
 * form, so nothing is left empty under "Send message". A dark glass office
 * bar floats along the bottom of the map — clear of the centred pin, Google's
 * place card (top-left), its logo and attribution (bottom) — with a city
 * switcher and that office's details in two columns. Below lg the map and
 * the bar stack.
 *
 * ARIA as in OfficeLocator: one tablist, one reused tabpanel, roving
 * tabindex, Arrow/Home/End keys that follow the writing direction.
 */

const label = "text-[10.5px] font-semibold uppercase tracking-[0.1em] text-bronze-300";
const darkLink =
  "font-medium text-white no-underline transition-colors duration-[var(--dur-fast)] hover:text-bronze-200 hover:underline";

function CompactDetails({ office }: { office: Office }) {
  const directions = directionsHref(office);
  return (
    <div className="@container">
      <div className="grid gap-x-6 gap-y-4 text-[13.5px] leading-[1.5] @lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className={label}>{office.name}</span>
            {office.pendingNote && (
              <span className="rounded-sm border border-white/20 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.06em] text-stone-300">
                {officeLabels.pending}
              </span>
            )}
          </div>
          {office.addressLines ? (
            <p className="m-0 text-stone-200">
              {office.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          ) : (
            <p className="m-0 text-stone-400">{office.pendingNote}</p>
          )}
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {office.shortAddress && (
              <span className="flex items-baseline gap-2">
                <span className="text-[10.5px] uppercase tracking-[0.08em] text-stone-400">
                  {officeLabels.shortAddress}
                </span>
                <span className="font-mono text-[12.5px] tracking-[0.08em] text-stone-200">
                  {office.shortAddress}
                </span>
              </span>
            )}
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-bronze-300 no-underline transition-colors hover:text-white hover:underline"
              >
                {officeLabels.directions}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
        <dl className="m-0 grid min-w-0 grid-cols-[auto_minmax(0,1fr)] content-start gap-x-3 gap-y-1.5 @lg:border-s @lg:border-white/10 @lg:ps-6">
          {office.phone && (
            <>
              <dt className={`${label} pt-[3px]`}>{officeLabels.phone}</dt>
              <dd className="m-0">
                <a href={`tel:${office.phone.replace(/\s/g, "")}`} className={darkLink}>
                  {office.phone}
                </a>
              </dd>
            </>
          )}
          {office.fax && (
            <>
              <dt className={`${label} pt-[3px]`}>{officeLabels.fax}</dt>
              <dd className="m-0 text-stone-200">{office.fax}</dd>
            </>
          )}
          <dt className={`${label} pt-[3px]`}>{officeLabels.email}</dt>
          <dd className="m-0 min-w-0">
            <a href={`mailto:${office.email}`} className={`${darkLink} break-words`}>
              {office.email}
            </a>
          </dd>
          {office.hours && (
            <>
              <dt className={`${label} pt-[3px]`}>{officeLabels.hours}</dt>
              <dd className="m-0 text-stone-200">{office.hours}</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}

export function OfficeSplit({ heading, form }: { heading: string; form: React.ReactNode }) {
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = `${baseId}-panel`;
  const headingId = `${baseId}-h`;
  const tabId = (i: number) => `${baseId}-tab-${offices[i].id}`;
  const office = offices[active];

  const select = (i: number) => {
    const next = (i + offices.length) % offices.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
    <div className="border-b border-border lg:grid lg:grid-cols-2">
      {/* Form half — its start edge lines up with the site container */}
      <div className="bg-sand px-[var(--container-x)] py-[clamp(3rem,6vw,5rem)] lg:pe-[clamp(2rem,4vw,3.5rem)] lg:ps-[max(var(--container-x),calc((100vw-var(--container-max))/2+var(--container-x)))]">
        {form}
      </div>

      {/* Map half — edge to edge, as tall as the form */}
      <div className="relative bg-stone-900">
        <div className="relative h-[340px] sm:h-[420px] lg:absolute lg:inset-0 lg:h-auto">
          <MapSurface office={office} />
        </div>

        <section
          aria-labelledby={headingId}
          className="on-dark relative bg-[#181512] text-stone-200 lg:absolute lg:inset-x-6 lg:bottom-14 lg:overflow-hidden lg:rounded-lg lg:bg-[#181512]/90 lg:shadow-lg lg:ring-1 lg:ring-white/10 lg:backdrop-blur-md"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-white/10 px-5 py-3">
            <h2
              id={headingId}
              className="m-0 font-display text-[12.5px] font-semibold uppercase tracking-[0.16em] text-bronze-300"
            >
              {heading}
            </h2>
            <div
              role="tablist"
              aria-label={heading}
              onKeyDown={onKeyDown}
              className="flex gap-1 rounded-full bg-white/8 p-1 ring-1 ring-white/10"
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
                    className={`cursor-pointer rounded-full border-none px-3.5 py-1.5 font-display text-[12.5px] font-semibold transition-colors duration-[var(--dur-fast)] ${
                      selected
                        ? "bg-bronze-400 text-stone-950"
                        : "bg-transparent text-stone-300 hover:text-white"
                    }`}
                  >
                    {o.city}
                  </button>
                );
              })}
            </div>
          </div>
          <div id={panelId} role="tabpanel" aria-labelledby={tabId(active)} className="px-5 py-4">
            <CompactDetails office={office} />
          </div>
        </section>
      </div>
    </div>
  );
}
