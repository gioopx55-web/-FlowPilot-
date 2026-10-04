"use client";

import * as React from "react";
import { createLocalStorageStore } from "@/lib/local-storage-store";

type ThemePreference = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

const STORAGE_KEY = "flowpilot-theme";

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

function parsePreference(raw: string | null): ThemePreference {
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}

const preferenceStore = createLocalStorageStore<ThemePreference>(
  STORAGE_KEY,
  parsePreference,
  (value) => value,
);

function subscribeSystemTheme(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function getSystemThemeSnapshot(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSystemThemeServerSnapshot(): ResolvedTheme {
  return "light";
}

/**
 * Theme architecture (Phase 5 §14-15): system preference by default,
 * manual override persisted client-side only (per-viewer convenience,
 * never shared/synced state), read via useSyncExternalStore so there is
 * no setState-in-effect hydration workaround. The no-flash inline script
 * in the root layout sets data-theme before hydration; the effect below
 * only keeps it in sync afterward (a DOM side effect, not a setState call).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = React.useSyncExternalStore(
    preferenceStore.subscribe,
    preferenceStore.getSnapshot,
    preferenceStore.getServerSnapshot,
  );
  const systemTheme = React.useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getSystemThemeServerSnapshot,
  );
  const resolvedTheme: ResolvedTheme =
    preference === "system" ? systemTheme : preference;

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  const setPreference = React.useCallback((next: ThemePreference) => {
    preferenceStore.set(next);
  }, []);

  const value = React.useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

/**
 * Inline, blocking script string for the root layout's <head> — reads
 * localStorage synchronously before paint so there is no flash of the
 * wrong theme. Kept as a plain string (not JSX) since it must run via
 * next/script with a fixed id, before hydration.
 */
export const noFlashThemeScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("${STORAGE_KEY}");
    var resolved = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", resolved);
  } catch (e) {}
})();
`;
