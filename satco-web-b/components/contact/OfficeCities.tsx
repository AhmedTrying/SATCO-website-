"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import { officeLabels, offices, type Office } from "@/content/offices";
import { MapSurface, directionsHref } from "@/components/contact/OfficeLocator";

/*
 * Option B — contact "two cities" (replaces the 2026-10-01 office directory,
 * which the user rejected on 2026-10-04).
 *
 * The page header is a deep bronze-brown band, as on B's About page: a small
 * bronze h1, the subline as the statement, then the two offices side by side,
 * each under its city name with a giant outlined echo of it behind. The phone
 * number is set large because it is the thing people come for. Below the
 * band, the form sits beside a map that stretches to the form's height, with
 * a Riyadh / Al Jubail switch; "View on map" in the band drives the same
 * switch and brings the map into view.
 */

const smallLabel =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-400";

const bandLink =
  "inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-bronze-300 no-underline transition-colors duration-[var(--dur-fast)] hover:text-white hover:underline";

function PinIcon() {
  return (
    <svg
      aria-hidden="true"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 10.2c0 6.6-8.5 12.3-8.5 12.3S3.5 16.8 3.5 10.2a8.5 8.5 0 0 1 17 0z" />
      <circle cx="12" cy="10.2" r="2.8" />
    </svg>
  );
}

function CityColumn({
  office,
  mapId,
  onShowMap,
}: {
  office: Office;
  mapId: string;
  onShowMap: () => void;
}) {
  const directions = directionsHref(office);
  return (
    <article
      aria-labelledby={`city-${office.id}-h`}
      className="relative isolate min-w-0 pt-[clamp(2.5rem,5vw,4rem)] md:row-span-5 md:grid md:grid-rows-subgrid"
    >
      {/* Giant outlined city name — decorative echo of the h3, sized to the
          column (cqw) so the longest name still fits. Its own query container:
          one on the column itself would switch the subgrid off. */}
      <div
        aria-hidden="true"
        className="@container pointer-events-none absolute inset-x-0 top-0 -z-10 select-none"
      >
        <span className="-ms-[0.04em] block whitespace-nowrap font-display text-[min(16.5cqw,7.5rem)] font-bold uppercase leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1.5px_rgb(232_190_120/0.18)]">
          {office.city}
        </span>
      </div>

      {/* Rows (shared with the other column via subgrid from md, so the
          phones and details line up): name · address · phone · details · actions */}
      <div>
        <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.18em] text-bronze-300">
          {office.name}
        </p>
        <h3
          id={`city-${office.id}-h`}
          className="mb-0 mt-1.5 font-display text-[clamp(1.9rem,3.2vw,2.6rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white"
        >
          {office.city}
        </h3>
      </div>

      <div>
        {office.addressLines ? (
          <p className="mb-0 mt-5 text-[15px] leading-[1.6] text-stone-300">
            {office.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        ) : (
          <p className="mb-0 mt-5 text-[15px] leading-[1.6] text-stone-400">
            {office.pendingNote}
          </p>
        )}
        {office.shortAddress && (
          /* Saudi National Address short code */
          <p className="mb-0 mt-2 flex flex-wrap items-baseline gap-2">
            <span className={smallLabel}>{officeLabels.shortAddress}</span>
            <span className="font-mono text-[13px] tracking-[0.08em] text-stone-200">
              {office.shortAddress}
            </span>
          </p>
        )}
      </div>

      {office.phone ? (
        <div className="mt-6">
          <span className={`block ${smallLabel}`}>{officeLabels.phone}</span>
          <a
            href={`tel:${office.phone.replace(/\s/g, "")}`}
            dir="ltr"
            className="mt-1 inline-block font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-[1.15] tracking-[-0.01em] text-white no-underline tabular-nums transition-colors duration-[var(--dur-fast)] hover:text-bronze-200"
          >
            {office.phone}
          </a>
          {office.fax && (
            /* Reference text, as on the letterhead — a fax line is not dialled */
            <span className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className={smallLabel}>{officeLabels.fax}</span>
              <span dir="ltr" className="text-[13.5px] text-stone-300">
                {office.fax}
              </span>
            </span>
          )}
        </div>
      ) : (
        <div aria-hidden="true" />
      )}

      <dl className="mb-0 mt-6 grid grid-cols-[auto_minmax(0,1fr)] content-start items-baseline gap-x-4 gap-y-2 border-t border-white/12 pt-5">
        <dt className={smallLabel}>{officeLabels.email}</dt>
        <dd className="m-0 min-w-0">
          <a
            href={`mailto:${office.email}`}
            className="break-words text-[15px] font-medium text-white no-underline transition-colors duration-[var(--dur-fast)] hover:text-bronze-200 hover:underline"
          >
            {office.email}
          </a>
        </dd>
        {office.hours && (
          <>
            <dt className={smallLabel}>{officeLabels.hours}</dt>
            <dd className="m-0 text-[15px] text-stone-200">{office.hours}</dd>
          </>
        )}
      </dl>

      <div className="mt-6 flex flex-wrap content-start items-center gap-x-6 gap-y-3">
        {office.mapEmbedUrl && (
          <button
            type="button"
            aria-controls={mapId}
            onClick={onShowMap}
            className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-bronze-300/50 bg-transparent px-3.5 py-2 text-[13.5px] font-semibold text-white transition-colors duration-[var(--dur-fast)] hover:border-bronze-300 hover:bg-white/5"
          >
            <PinIcon />
            {officeLabels.showOnMap}
            <span className="sr-only">: {office.city}</span>
          </button>
        )}
        {directions && (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className={bandLink}
          >
            {officeLabels.directions}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

export function OfficeCities({
  title,
  headingId,
  lead,
  heading,
  form,
}: {
  title: string;
  headingId: string;
  lead: string;
  /** "Get in touch" — names the offices section for assistive tech */
  heading: string;
  form: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapId = "contact-map";
  const office = offices[active];

  // From the band: switch the map, then bring it into view (instantly under
  // reduced motion). On wide screens it sits just below the band.
  const showMap = (i: number) => {
    setActive(i);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    mapRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      <div className="on-dark relative isolate overflow-hidden bg-bronze-950 text-stone-200">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_15%_0%,rgb(209_138_32/0.22),transparent_70%)] rtl:bg-[radial-gradient(60%_70%_at_85%_0%,rgb(209_138_32/0.22),transparent_70%)]"
        />
        <Container className="pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(2.75rem,5.5vw,4.5rem)]">
          <h1
            id={headingId}
            className="m-0 font-display text-[13px] font-semibold uppercase tracking-[0.22em] text-bronze-300"
          >
            {title}
          </h1>
          <p className="mb-0 mt-5 max-w-[34ch] font-display text-[clamp(1.4rem,2.4vw,2.1rem)] font-medium leading-[1.3] tracking-[-0.012em] text-white">
            {lead}
          </p>

          <section
            aria-labelledby="offices-h"
            className="mt-[clamp(2.5rem,5vw,3.5rem)]"
          >
            <h2 id="offices-h" className="sr-only">
              {heading}
            </h2>
            <div className="grid gap-y-12 border-t border-white/15 md:grid-cols-2 md:gap-0">
              {offices.map((o, i) => (
                <div
                  key={o.id}
                  className={`min-w-0 md:row-span-5 md:grid md:grid-rows-subgrid ${i > 0 ? "border-t border-white/15 md:border-s md:border-t-0 md:ps-[clamp(1.5rem,4vw,4rem)]" : "md:pe-[clamp(1.5rem,4vw,4rem)]"}`}
                >
                  <CityColumn
                    office={o}
                    mapId={mapId}
                    onShowMap={() => showMap(i)}
                  />
                </div>
              ))}
            </div>
          </section>
        </Container>
      </div>

      <Container className="grid grid-cols-1 gap-[clamp(1.5rem,3vw,2.5rem)] py-[clamp(3rem,6vw,5rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-stretch">
        {form}
        <div ref={mapRef} className="flex min-h-[340px] scroll-mt-[calc(var(--nav-h)+1.5rem)] flex-col">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="m-0 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-stone-600">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-bronze-500"
              />
              {office.mapCaption}
            </p>
            {/* Map switch — buttons with aria-pressed, one per office */}
            <div
              role="group"
              aria-label={officeLabels.mapSwitch}
              className="inline-flex rounded-md border border-border bg-sand p-0.5"
            >
              {offices.map((o, i) => {
                const selected = i === active;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={selected}
                    aria-controls={mapId}
                    onClick={() => setActive(i)}
                    className={`cursor-pointer rounded-[5px] border-none px-3 py-1.5 text-[13px] font-semibold transition-colors duration-[var(--dur-fast)] ${
                      selected
                        ? "bg-bronze-900 text-white shadow-xs"
                        : "bg-transparent text-stone-700 hover:text-bronze-800"
                    }`}
                  >
                    {o.city}
                  </button>
                );
              })}
            </div>
          </div>
          <div
            id={mapId}
            className="relative min-h-[300px] flex-1 overflow-hidden rounded-lg border border-border bg-sand shadow-xs"
          >
            <MapSurface office={office} />
          </div>
        </div>
      </Container>
    </>
  );
}
