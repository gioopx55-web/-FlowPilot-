import { chromium } from "playwright";

export const BASE_URL = process.env.QA_BASE_URL ?? "http://localhost:3000";

/** Opens a browser, signs in to the demo session once, and returns { browser, context }. */
export async function launchSignedIn() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /continue to demo/i }).click();
  await page.waitForURL("**/dashboard");
  // Dismiss first-session onboarding so it doesn't sit in front of every route this run visits.
  const skip = page.getByRole("button", { name: "Skip" });
  if (await skip.isVisible().catch(() => false)) {
    await skip.click();
  }
  await page.close();
  return { browser, context };
}
