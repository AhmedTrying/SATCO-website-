"use client";

import { motion, type Easing } from "framer-motion";
import { ease, revealDistance } from "@/lib/motion";

/**
 * Scroll reveal: fade + 20px rise, once (plan §7). Under prefers-reduced-motion
 * the MotionConfig gate strips the transform, leaving an opacity-only reveal.
 *
 * `fadeOnly` drops the rise entirely — required for the Selected Clients logo
 * grid, which is locked to "no animation beyond a subtle fade-in" (comment #31).
 *
 * The `reveal-init` class pairs with the <noscript> override in app/layout.tsx
 * so server-rendered content is visible when JavaScript is unavailable.
 */
export function Reveal({
  delay = 0,
  fadeOnly = false,
  className,
  children,
}: {
  /** ms, matching the design's data-reveal-delay values */
  delay?: number;
  fadeOnly?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={className ? `reveal-init ${className}` : "reveal-init"}
      initial={{ opacity: 0, y: fadeOnly ? 0 : revealDistance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -7% 0px", amount: 0.12 }}
      transition={{
        duration: 0.6,
        ease: ease.outExpo as unknown as Easing,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
