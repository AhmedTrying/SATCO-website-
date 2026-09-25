"use client";

import { useEffect, useRef } from "react";
import lottie, { type AnimationItem } from "lottie-web/build/player/lottie_light";

/**
 * Animated line icon (Lottie, SVG renderer — the light player, no expressions).
 * Plays once when `play` flips true; StatBand passes the same in-view trigger
 * that starts the count-up so icons and numbers animate together (plan §7:
 * once, on scroll into view). Under prefers-reduced-motion it snaps straight
 * to the final frame — a complete static icon, no motion. Decorative only
 * (aria-hidden): the stat labels carry the meaning.
 */
export function LottieIcon({
  data,
  play,
  size = 30,
  className,
}: {
  /** Lottie animation JSON (statically imported) */
  data: object;
  /** one-way trigger: starts playback (or the reduced-motion final-frame snap) */
  play: boolean;
  /** rendered box in px */
  size?: number;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const anim = lottie.loadAnimation({
      container: el,
      renderer: "svg",
      loop: false,
      autoplay: false,
      // lottie-web mutates animationData while parsing; clone so the shared
      // module-level import stays pristine across mounts (dev StrictMode).
      animationData: structuredClone(data),
    });
    animRef.current = anim;
    return () => {
      animRef.current = null;
      anim.destroy();
    };
  }, [data]);

  useEffect(() => {
    const anim = animRef.current;
    if (!anim || !play) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      anim.goToAndStop(Math.max(anim.totalFrames - 1, 0), true);
    } else {
      anim.goToAndPlay(0, true);
    }
  }, [play]);

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
