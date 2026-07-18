"use client";

import { MotionConfig } from "framer-motion";

/** Global motion gate — every Framer animation honours prefers-reduced-motion (plan §7). */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
