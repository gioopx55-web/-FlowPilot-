"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * Global CSS already zeroes out CSS transitions/animations under
 * `prefers-reduced-motion: reduce` (globals.css, Phase 4 §15.13/§15.18).
 * Recharts' entrance animation is driven by JS (requestAnimationFrame
 * tweening via its `isAnimationActive` prop), which that CSS rule
 * cannot reach — this hook is Phase 11's one addition so chart
 * components can disable it explicitly instead of silently ignoring
 * the preference. `useSyncExternalStore` (rather than a
 * useState+useEffect pair) is the correct primitive for subscribing
 * to this kind of external browser state.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
