"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/*
 * Scroll-linked parallax drift (plan §7, UCC-reference upgrade). The element
 * slides from +strength to -strength px across its journey through the
 * viewport. Scroll-linked values bypass MotionConfig, so reduced motion is
 * gated here explicitly: the transform is dropped entirely (scale kept — it's
 * static framing, not motion). Vertical-only, so the RTL seam is untouched.
 */
export function Parallax({
  strength = 24,
  scale,
  className,
  children,
}: {
  /** px of total drift ÷ 2; negative inverts the direction (foreground cards) */
  strength?: number;
  /** static zoom applied with the drift so edges never show (background fills) */
  scale?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [strength, -strength]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? { scale } : { y, scale }}
    >
      {children}
    </motion.div>
  );
}
