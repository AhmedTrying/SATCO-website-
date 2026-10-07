"use client";

import { cubicBezier } from "framer-motion";
import { useLayoutEffect, useState, type RefObject } from "react";
import { ease } from "@/lib/motion";

/*
 * Option C: the SATCO logo docks from the home hero into the header.
 *
 * At the top of the home page the lockup is part of the hero (#hero-logo in
 * SectorSlider) and the header's own logo is hidden. When the header turns
 * solid, the header logo takes over from the hero lockup at the same position
 * and size, then moves and shrinks into its slot; back at the top it returns
 * the same way. Both are the same LogoLockup markup (the hero one scaled up
 * with a CSS transform), so the swap is invisible and only one logo ever shows.
 *
 * The flight is a single number, f (0 = on the hero lockup, 1 = in the header
 * slot), eased over FLIGHT_MS; the header logo is drawn between the two ends
 * with a transform. The hero end is measured live every frame, so the logo
 * leaves with the scrolling hero and lands on it exactly, and reversing
 * mid-flight carries on from wherever the logo is.
 *
 * Resting states are CSS (globals.css): html[data-logo-dock] hides the hero
 * lockup while the header logo is flying or docked, and the header logo is
 * hidden while the header is transparent, so the server HTML already paints
 * the hero state on "/". Reduced motion swaps instantly.
 */

const FLIGHT_MS = 550;
/** Arriving from the home hero on another page: the hero lockup is gone. */
const FADE_MS = 250;
const easing = cubicBezier(...ease.standard);

/** Header-logo transform relative to its own slot: translate (px) + scale. */
type Frame = { x: number; y: number; k: number };

function heroFrame(hero: HTMLElement, slot: DOMRect): Frame {
  const r = hero.getBoundingClientRect();
  return { x: r.left - slot.left, y: r.top - slot.top, k: r.height / slot.height };
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

class LogoDock {
  private link: HTMLElement | null = null;
  private logo: HTMLElement | null = null;
  private f = 0;
  private target: 0 | 1 = 0;
  private from = 0;
  private start = 0;
  private duration = 0;
  private raf = 0;
  private ready = false;
  /** Highest the hero end may rise this segment (slot-relative y, px). */
  private floor = 0;
  private anchorY = 0;

  sync(docked: boolean, link: HTMLElement, logo: HTMLElement) {
    this.link = link;
    this.logo = logo;
    const target = docked ? 1 : 0;

    if (!this.ready) {
      // First paint (and hydration): take the current state without motion.
      this.ready = true;
      this.settle(target);
      return;
    }
    if (target === this.target) return;

    const hero = document.getElementById("hero-logo");
    const flying = this.raf !== 0;
    const atHero = !flying && this.f === 0;

    if (!hero || reducedMotion()) {
      this.settle(target);
      // Left home from the top: the hero lockup went with the old page, so the
      // header logo fades in with the incoming one instead.
      if (!hero && target === 1 && atHero && !reducedMotion()) {
        logo.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: FADE_MS,
          easing: "ease-out",
        });
      }
      return;
    }

    // A hero lockup already off screen (a jump down the page) has nothing to
    // fly from.
    if (target === 1 && atHero) {
      const r = hero.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= window.innerHeight) {
        this.settle(1);
        return;
      }
    }

    // The hero end may follow the page up to the header slot, or to wherever
    // it already is if that's higher, but no further: a fast scroll can't drag
    // the logo past the slot, and a segment never starts with a jump.
    const heroY = heroFrame(hero, link.getBoundingClientRect()).y;
    this.floor = Math.min(0, flying ? this.anchorY : heroY);

    this.target = target;
    this.from = this.f;
    this.start = performance.now();
    this.duration = FLIGHT_MS * Math.abs(target - this.f);
    document.documentElement.dataset.logoDock = "flying";
    logo.style.pointerEvents = "none";
    this.render(hero);
    if (!flying) this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const hero = document.getElementById("hero-logo");
    const u = Math.min(1, Math.max(0, (now - this.start) / this.duration));
    this.f = this.from + (this.target - this.from) * easing(u);
    if (u >= 1 || !hero) {
      this.settle(this.target);
      return;
    }
    this.render(hero);
    this.raf = requestAnimationFrame(this.tick);
  };

  private render(hero: HTMLElement) {
    if (!this.link || !this.logo) return;
    const { f } = this;
    const a = heroFrame(hero, this.link.getBoundingClientRect());
    a.y = this.anchorY = Math.max(a.y, this.floor);
    this.logo.style.transform = `translate(${a.x * (1 - f)}px, ${a.y * (1 - f)}px) scale(${a.k + (1 - a.k) * f})`;
    // White over the hero, the header's bronze as it arrives.
    this.logo.style.setProperty(
      "--logo-wordmark",
      `color-mix(in srgb, var(--bronze-800) ${(f * f * 100).toFixed(1)}%, #ffffff)`,
    );
  }

  private settle(target: 0 | 1) {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.target = target;
    this.f = target;
    this.logo?.style.removeProperty("transform");
    this.logo?.style.removeProperty("--logo-wordmark");
    this.logo?.style.removeProperty("pointer-events");
    document.documentElement.dataset.logoDock = target ? "docked" : "hero";
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.ready = false;
    delete document.documentElement.dataset.logoDock;
  }
}

/** Docks the header logo (inside `linkRef`) from the home hero; see above. */
export function useLogoDock(
  docked: boolean,
  linkRef: RefObject<HTMLElement | null>,
  logoRef: RefObject<HTMLElement | null>,
) {
  const [dock] = useState(() => new LogoDock());

  // Layout effect: the first flight frame lands in the same paint as the
  // header's solid/transparent switch.
  useLayoutEffect(() => {
    const link = linkRef.current;
    const logo = logoRef.current;
    if (link && logo) dock.sync(docked, link, logo);
  }, [dock, docked, linkRef, logoRef]);

  useLayoutEffect(() => () => dock.destroy(), [dock]);
}
