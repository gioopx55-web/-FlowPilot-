import "server-only";
import { cookies } from "next/headers";

/**
 * Demo session (Phase 14 §3) — the smallest clean mechanism that
 * actually satisfies the requirement ("app routes know whether a
 * demo session is active"). This is a presence cookie, not a signed/
 * encrypted session token: there is no real credential, no password,
 * and no per-user data behind it to protect (every visitor sees the
 * exact same single demo workspace, per Constitution §4's "no real
 * auth" exclusion) — encrypting a flag that carries zero secret
 * information would be security theater, not security. `httpOnly` is
 * still set so casual client-side JS can't silently clear it.
 *
 * This is intentionally NOT a general-purpose auth library and NOT a
 * users/sessions table — see DECISIONS.md for the full reasoning and
 * why a real auth dependency was judged unnecessary for V1.
 *
 * Phase 20 security gate (D-093): `secure` is gated on `NODE_ENV`
 * (Next.js sets this automatically — no `.env` file involved) so the
 * cookie is never sent over plain HTTP once this is actually deployed,
 * while still working over `http://localhost` in dev.
 */
export const DEMO_SESSION_COOKIE = "fp_demo_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export async function createDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearDemoSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
}

export async function hasDemoSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(DEMO_SESSION_COOKIE)?.value === "1";
}
