"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getYear = () => new Date().getFullYear();

/**
 * Current year, evaluated in the visitor's browser — a static export would
 * otherwise bake in the build year and go stale after Dec 31 (the approved
 * design also sets the footer year client-side). useSyncExternalStore renders
 * the build year in the exported HTML and swaps to the visit year on
 * hydration without a mismatch error.
 */
export function Year() {
  const year = useSyncExternalStore(subscribe, getYear, getYear);
  return <span>{year}</span>;
}
