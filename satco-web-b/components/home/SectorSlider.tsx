"use client";

import Link from "next/link";
import { motion, type Easing } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { home } from "@/content/home";
import { sectors } from "@/content/sectors";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { Picture } from "@/components/ui/Picture";

/*
 * Hero sector carousel per the approved design + plan §7: 4 crossfading slides,
 * ~6s auto-advance that pauses on hover (slide text and controls only) and
 * keyboard focus, prev/next, dots, arrow keys and
 * aria-live announcements. There is no pause button: it was removed at the
 * client's request on 2026-09-30 (plan §7 had added one for WCAG 2.2.2), so
 * hover and keyboard focus are the only ways to hold a slide. Autoplay is
 * disabled entirely under prefers-reduced-motion.
 *
 * Cinematic layer (UCC-reference upgrade): Ken Burns drift on the active slide
 * and an autoplay progress fill in the active dot (both CSS, globals.css —
 * covered by the global reduced-motion clamp), plus a rise-in on the sector
 * text at each slide change (Framer, stripped to fade by MotionConfig under
 * reduced motion). The first paint never animates, so exported HTML carries no
 * hidden state.
 */

const AUTO_MS = 6000;

// Module flag, same pattern as app/template.tsx: false during build/SSR and the
// hydration render (so exported HTML never hides the hero text), true from the
// first client mount onward — slide changes and client-side revisits animate.
let heroHydrated = false;

const circleButton =
  "inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-[50%] border border-bronze-100/40 bg-stone-950/35 text-white transition-colors hover:border-bronze-300 hover:bg-bronze-800/65";

export function SectorSlider() {
  const slides = sectors;
  const [index, setIndex] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const reduced = useRef(false);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const autoplayPaused = hovering || focused;
  // Hover holds the slide only over the slide text and the controls. The hero
  // fills the first screen, so pausing on the whole region froze autoplay
  // whenever the pointer rested on the page (e.g. after scrolling back up).
  const holdOnHover = {
    onMouseEnter: () => setHovering(true),
    onMouseLeave: () => setHovering(false),
  };
  const timer = useRef<number | undefined>(undefined);
  const animateText = heroHydrated;
  useEffect(() => {
    heroHydrated = true;
  }, []);

  const go = useCallback(
    (next: number, announce = true) => {
      const target = (next + slides.length) % slides.length;
      setIndex(target);
      if (announce) {
        // Manual navigation keeps autoplay running with the control focused.
        setHovering(false);
        setFocused(false);
        setAnnouncement(
          `Slide ${target + 1} of ${slides.length}: ${slides[target].name}`,
        );
      }
    },
    [slides],
  );

  // Auto-advance — cleared while hovered/focused, or under reduced motion.
  // Auto-rotation is SILENT (announce=false): only user-initiated changes go to
  // the live region, per the APG carousel pattern.
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (autoplayPaused || reduced.current) return;
    const tick = () => {
      go(index + 1, false);
    };
    timer.current = window.setInterval(tick, AUTO_MS);
    return () => window.clearInterval(timer.current);
  }, [index, autoplayPaused, go]);

  const current = slides[index];

  return (
    <div
      id="hero"
      role="region"
      aria-roledescription="carousel"
      aria-label={home.hero.regionLabel}
      tabIndex={0}
      data-paused={autoplayPaused || undefined}
      // Full-screen hero, as in Option C: fills the first screen
      // (.hero-fullscreen, globals.css) and tucks under the header's 1px
      // bottom border, so no strip of page background shows along the top.
      className="on-dark hero-fullscreen relative -mt-[calc(var(--nav-h)+1px)] flex items-end overflow-hidden bg-stone-950"
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
      // Keyboard focus only: a mouse click on the slide (which focuses this
      // tabIndex region) or on a control is not :focus-visible, so it no
      // longer holds the slide until the user clicks elsewhere.
      onFocusCapture={(e) => {
        if ((e.target as Element).matches(":focus-visible")) setFocused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setFocused(false);
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
          {/* .kenburns is present only while active — re-adding the class on a
              later activation restarts the drift from scale(1). */}
          <div className={i === index ? "kenburns absolute inset-0" : "absolute inset-0"}>
            <Picture
              image={sector.hero}
              sizes="100vw"
              priority={i === 0}
              className="absolute inset-0"
              imgClassName="h-full w-full object-cover"
              style={{ height: "100%", width: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      ))}

      {/* Bronze→ink scrim for text contrast (design) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[3] bg-[linear-gradient(95deg,rgb(53_30_3/0.88),rgb(53_30_3/0.52)_46%,rgb(35_31_26/0.12)),linear-gradient(0deg,rgb(29_26_22/0.72),rgb(29_26_22/0)_54%)] rtl:bg-[linear-gradient(265deg,rgb(53_30_3/0.88),rgb(53_30_3/0.52)_46%,rgb(35_31_26/0.12)),linear-gradient(0deg,rgb(29_26_22/0.72),rgb(29_26_22/0)_54%)]"
      />

      {/* Bottom spacing also follows the viewport height (the min(vw, svh)
          term, as in Option C), so the full-screen hero still fits short
          laptop displays. */}
      <div className="relative z-[5] mx-auto flex w-full max-w-[var(--container-max)] flex-col justify-end px-[var(--container-x)] pb-[clamp(2.5rem,min(5vw,7.1svh),4rem)] pt-[calc(var(--nav-h)+1.5rem)]">
        {/* FIX-16: no hero eyebrow or headline; each slide leads with its
            sector title. The page still needs an h1, so it is visually hidden. */}
        <h1 id="home-h1" className="sr-only">
          {site.legalName}
        </h1>

        <div className="flex flex-wrap items-end justify-between gap-7">
          {/* 940px keeps every (larger, FIX-16) sector title on one line on
              desktop. */}
          <div className="max-w-[940px]" {...holdOnHover}>
            {/* Keyed by slide: remounts and rises in on every change. The CTA
                stays OUTSIDE so keyboard focus is never dropped mid-cycle. */}
            <motion.div
              key={current.slug}
              initial={animateText ? { opacity: 0, y: 18 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: ease.outExpo as unknown as Easing }}
            >
              <h2 className="mb-3 mt-0 font-display text-[clamp(2rem,4.2vw,3rem)] font-bold leading-[1.08] tracking-[-0.01em] text-white">
                {current.name}
              </h2>
              <p className="mb-6 mt-0 text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.5] text-stone-50/90">
                {current.tagline}
              </p>
            </motion.div>
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

          <div className="flex flex-col items-start gap-[18px]" {...holdOnHover}>
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
                    className="block h-2.5 overflow-hidden rounded-[5px] transition-[width,background-color] duration-300"
                    style={{
                      width: i === index ? 34 : 10,
                      background: i === index ? "rgb(245 233 214 / 0.28)" : "rgb(245 233 214 / 0.4)",
                    }}
                  >
                    {i === index ? (
                      // Autoplay progress: refills each cycle (keyed remount).
                      // CSS in globals.css freezes it on hover/focus.
                      <span
                        key={`cycle-${index}`}
                        className="dot-progress block h-full rounded-[5px] bg-bronze-100"
                      />
                    ) : null}
                  </span>
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
