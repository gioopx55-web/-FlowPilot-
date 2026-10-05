"use server";

import { redirect } from "next/navigation";
import { createDemoSession, clearDemoSession } from "@/lib/demoSession";
import { sanitizeRedirectTarget } from "@/lib/protectedRoutes";

/** Establishes the demo session and redirects to the (sanitized) intended destination, or /dashboard. */
export async function signInToDemoAction(redirectTo?: string): Promise<never> {
  await createDemoSession();
  redirect(sanitizeRedirectTarget(redirectTo));
}

/** Clears the demo session and returns to the public Landing Page. */
export async function signOutOfDemoAction(): Promise<never> {
  await clearDemoSession();
  redirect("/");
}
