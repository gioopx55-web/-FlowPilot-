"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

/**
 * Appearance (Phase 14 §11) — reuses the existing `useTheme()` from
 * the Phase 5 `ThemeProvider` directly; no second theme state. Locale/
 * RTL is not exposed here: `getLocale()` is still a hardcoded
 * function with no setter (V1 is English-only, Phase 5/§16), so there
 * is no real toggle to surface yet — adding one would be building new
 * architecture, not exposing existing behavior.
 */
export function AppearanceSettingsForm() {
  const { preference, setPreference } = useTheme();

  return (
    <div className="max-w-md">
      <span className="mb-2 block text-xs text-muted-foreground">Theme</span>
      <div role="radiogroup" aria-label="Theme" className="flex gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={preference === option.value}
            onClick={() => setPreference(option.value)}
            className={cn(
              "h-9 min-w-20 rounded-sm border px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/70",
              preference === option.value
                ? "border-[var(--fp-accent)] bg-[var(--fp-accent-subtle-bg)] text-[var(--fp-accent)]"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Saved to this browser only — not shared across devices in the demo.
      </p>
    </div>
  );
}
