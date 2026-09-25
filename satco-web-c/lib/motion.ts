/*
 * Framer Motion values mirroring the CSS motion tokens (plan §3.8).
 * Seconds (Framer convention); keep in sync with styles/tokens.css.
 */

export const dur = {
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  xslow: 0.7,
} as const;

export const ease = {
  standard: [0.2, 0, 0, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

/** translateY distance for scroll reveals, px */
export const revealDistance = 20;

/** child stagger for reveals, seconds */
export const stagger = 0.08;
