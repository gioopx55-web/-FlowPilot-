import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE } from "@/lib/demoSession";
import { isProtectedPath } from "@/lib/protectedRoutes";

/**
 * Centralized route protection (Phase 14 §4) — the one place that
 * decides whether a request may reach an authenticated app route,
 * rather than a guard repeated in every page/layout. This is an
 * "optimistic check" per Next.js's own guidance (reads only the
 * cookie's presence, no decryption/lookup) — appropriate here since
 * there is no real per-user data behind the demo session to protect
 * more strictly (see `lib/demoSession.ts`).
 *
 * `/` and `/login` are never protected. Visiting `/login` while
 * already in a demo session redirects straight to `/dashboard`
 * rather than showing the login screen again.
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(DEMO_SESSION_COOKIE)?.value === "1";

  if (isProtectedPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)"],
};
