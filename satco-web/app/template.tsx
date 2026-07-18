"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Understated page transition (plan §7): a short opacity fade on route change.
 * The fade runs ONLY on client-side navigations — on the initial load (and in
 * the exported HTML) `initial` is false, so server output never carries
 * opacity:0 and the site is fully visible without JavaScript.
 * Instant under prefers-reduced-motion.
 */
let hasNavigated = false;

export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const animateIn = hasNavigated && !reduced;

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <motion.div
      initial={animateIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: animateIn ? 0.25 : 0, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
