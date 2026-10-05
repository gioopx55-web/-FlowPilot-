/**
 * The one list of protected route prefixes (Phase 14 §4) — read by
 * both `proxy.ts` (route protection) and the demo sign-in action
 * (safe post-login redirect validation), so there is exactly one
 * place that decides what counts as "inside the app."
 */
export const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/projects",
  "/tasks",
  "/clients",
  "/team",
  "/analytics",
  "/settings",
] as const;

export const DEFAULT_PROTECTED_ROUTE = "/dashboard";

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Only ever used for the `redirect` query param on `/login` — never
 * trust an arbitrary string as a redirect target (open-redirect
 * risk). A value only passes if it's an internal, known-protected
 * path; anything else (an external URL, `//evil.com`, an unknown
 * route) falls back to `DEFAULT_PROTECTED_ROUTE`.
 */
export function sanitizeRedirectTarget(raw: string | undefined | null): string {
  if (!raw) return DEFAULT_PROTECTED_ROUTE;
  if (!raw.startsWith("/") || raw.startsWith("//")) return DEFAULT_PROTECTED_ROUTE;
  return isProtectedPath(raw) ? raw : DEFAULT_PROTECTED_ROUTE;
}
