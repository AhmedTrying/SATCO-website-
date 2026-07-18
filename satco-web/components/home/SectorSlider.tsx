"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { home } from "@/content/home";
import { sectors } from "@/content/sectors";
import { Picture } from "@/components/ui/Picture";

/*
 * Hero sector carousel per the approved design + plan §7: 4 crossfading slides,
 * ~6s auto-advance that pauses on hover/focus, prev/next, dots, arrow keys,
 * aria-live announcements, and a visible pause control (plan §7 / WCAG 2.2.2 —
 * added over the design, which had hover-pause only). Autoplay is disabled
 * entirely under prefers-reduced-motion.
 */

const AUTO_MS = 6000;

const circleButton =
  "inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-[50%] border border-bronze-100/40 bg-stone-950/35 text-white transition-colors hover:border-bronze-300 hover:bg-bronze-800/65";

export function SectorSlider() {
  const slides = sectors;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const reduced = useRef(false);
  const hovering = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  const go = useCallback(
    (next: number, announce = true) => {
      const target = (next + slides.length) % slides.length;
      setIndex(target);
      if (announce) {
        setAnnouncement(
          `Slide ${target + 1} of ${slides.length}: ${slides[target].name}`,
        );
      }
    },
    [slides],
  );

  // Auto-advance — cleared while paused (control), hovered/focused, or reduced-motion.
  // Auto-rotation is SILENT (announce=false): only user-initiated changes go to
  // the live region, per the APG carousel pattern.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduced.current) return;
    const tick = () => {
      if (!hovering.current) go(index + 1, false);
    };
    timer.current = window.setInterval(tick, AUTO_MS);
    return () => window.clearInterval(timer.current);
  }, [index, paused, go]);

  const current = slides[index];

  return (
    <div
      id="hero"
      role="region"
      aria-roledescription="carousel"
      aria-label={home.hero.regionLabel}
      tabIndex={0}
      className="on-dark relative -mt-[var(--nav-h)] flex min-h-[min(92vh,820px)] items-end overflow-hidden bg-stone-950"
      onKeyDown={(e) => {
        // Direction-aware for the RTL seam: "forward" follows reading direction
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(index + (rtl ? -1 : 1));
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(index + (rtl ? 1 : -1));
        }
      }}
      onMouseEnter={() => {
        hovering.current = true;
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
      onFocusCapture={() => {
        hovering.current = true;
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          hovering.current = false;
        }
      }}
    >
      {slides.map((sector, i) => (
        <div
          key={sector.slug}
          aria-hidden={i !== index}
          className="absolute inset-0 transition-[opacity,visibility] duration-[750ms] ease-in-out"
          style={{
            opacity: i === index ? 1 : 0,
            visibility: i === index ? "visible" : "hidden",
            zIndex: i === index ? 2 : 1,
          }}
        >
          <Picture
            image={sector.hero}
            sizes="100vw"
            priority={i === 0}
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </div>
      ))}

      {/* Bronze→ink scrim for text contrast (design) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[linear-gradient(95deg,rgb(53_30_3/0.88),rgb(53_30_3/0.52)_46%,rgb(35_31_26/0.12)),linear-gradient(0deg,rgb(29_26_22/0.72),rgb(29_26_22/0)_54%)] rtl:bg-[linear-gradient(265deg,rgb(53_30_3/0.88),rgb(53_30_3/0.52)_46%,rgb(35_31_26/0.12)),linear-gradient(0deg,rgb(29_26_22/0.72),rgb(29_26_22/0)_54%)]"
      />

      <div className="relative z-[5] mx-auto flex w-full max-w-[var(--container-max)] flex-col justify-end gap-[clamp(2rem,5vw,3.5rem)] px-[var(--container-x)] pb-[clamp(2.5rem,5vw,4rem)] pt-[120px]">
        <div className="max-w-[820px]">
          <p className="mb-[18px] mt-0 font-display text-[13px] font-semibold uppercase tracking-[0.16em] text-bronze-200">
            {home.hero.eyebrow}
          </p>
          <h1
            id="home-h1"
            className="m-0 font-display text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.05] tracking-[-0.015em] text-white [text-wrap:balance]"
          >
            {home.hero.headline}
          </h1>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-7 border-t border-bronze-100/25 pt-[clamp(1.4rem,3vw,2rem)]">
          <div className="max-w-[600px]">
            <p className="mb-2.5 mt-0 font-display text-[12.5px] font-semibold tracking-[0.16em] text-bronze-200 tabular-nums">
              Sector {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </p>
            <h2 className="mb-2.5 mt-0 font-display text-[clamp(1.55rem,3.4vw,2.35rem)] font-bold leading-[1.12] tracking-[-0.01em] text-white">
              {current.name}
            </h2>
            <p className="mb-5 mt-0 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.5] text-stone-50/90">
              {current.tagline}
            </p>
            <Link
              href={`/sectors/${current.slug}`}
              className="inline-flex items-center gap-2 rounded-sm bg-white px-[22px] py-[13px] text-[15px] font-semibold text-bronze-800 no-underline transition-[gap,background-color] duration-[var(--dur-base)] hover:gap-[13px] hover:bg-bronze-50 hover:text-bronze-800"
            >
              {home.hero.explore}{" "}
              <span aria-hidden="true" className="rtl:-scale-x-100">
                →
              </span>
            </Link>
          </div>

          <div className="flex flex-col items-start gap-[18px]">
            <div className="flex gap-2.5">
              <button
                type="button"
                aria-label="Previous slide"
                className={circleButton}
                onClick={() => go(index - 1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next slide"
                className={circleButton}
                onClick={() => go(index + 1)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                className={circleButton}
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <polygon points="8 5 19 12 8 19" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                )}
              </button>
            </div>
            <div role="group" aria-label="Slide selection" className="flex items-center gap-2">
              {slides.map((sector, i) => (
                <button
                  key={sector.slug}
                  type="button"
                  aria-label={sector.name}
                  aria-current={i === index}
                  className="group/dot cursor-pointer border-none bg-transparent p-1.5"
                  onClick={() => go(i)}
                >
                  <span
                    aria-hidden="true"
                    className="block h-2.5 rounded-[5px] transition-[width,background-color] duration-300"
                    style={{
                      width: i === index ? 30 : 10,
                      background: i === index ? "var(--bronze-100)" : "rgb(245 233 214 / 0.4)",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
