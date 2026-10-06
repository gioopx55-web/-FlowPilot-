import { createLocalStorageStore } from "@/lib/local-storage-store";

/**
 * First-session onboarding flag (Phase 21.1 §3/D-096) — a per-viewer
 * `localStorage` flag, same `createLocalStorageStore` primitive
 * already used for theme preference and Sidebar collapse state (zero
 * new dependency, zero new persistence mechanism).
 *
 * Deliberately NOT a security-sensitive decision and deliberately NOT
 * stored server-side via the D-039 demo-state overrides: whether
 * *this browser* has seen the onboarding tour has no bearing on
 * access control or shared workspace data, so it belongs with the
 * other purely-cosmetic per-viewer preferences, not in the
 * shared-across-every-visitor demo-state layer. Choosing
 * `localStorage` here is a deliberate, documented decision, not an
 * oversight — see DECISIONS.md D-096.
 */
const STORAGE_KEY = "flowpilot-onboarding-complete";

function parse(raw: string | null): boolean {
  return raw === "1";
}

function serialize(value: boolean): string {
  return value ? "1" : "0";
}

export const onboardingStore = createLocalStorageStore<boolean>(STORAGE_KEY, parse, serialize);
