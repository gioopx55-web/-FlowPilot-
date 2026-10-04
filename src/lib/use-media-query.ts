"use client";

import * as React from "react";

/**
 * SSR-safe media query hook via useSyncExternalStore (same pattern as
 * the theme store) — avoids the setState-in-effect anti-pattern for
 * reading an external (viewport) condition.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (listener: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    },
    [query],
  );
  const getSnapshot = React.useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );
  const getServerSnapshot = React.useCallback(() => false, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Phase 4 §15.12 mobile breakpoint boundary (<640px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639.98px)");
}
