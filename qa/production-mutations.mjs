#!/usr/bin/env node
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { BASE_URL } from "./lib.mjs";

const CREATED_NAME = "Production State E2E";
const EDITED_NAME = "Brand Refresh — Production E2E";

async function signIn(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /continue to demo/i }).click();
  await page.waitForURL("**/dashboard");
  const skip = page.getByRole("button", { name: "Skip" });
  if (await skip.isVisible().catch(() => false)) await skip.click();
}

async function reset(page) {
  await page.goto(`${BASE_URL}/settings/workspace`, { waitUntil: "networkidle" });
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await page.getByText("Demo data reset.").waitFor();
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await signIn(page);
    await reset(page);

    // Server Action -> redirect render -> refresh -> related selectors.
    await page.goto(`${BASE_URL}/projects/new`, { waitUntil: "networkidle" });
    await page.getByLabel("Name").fill(CREATED_NAME);
    await page.getByLabel("Client").selectOption("cl_harbor_thistle");
    await page.getByLabel("Progress (%)").fill("15");
    await page.getByLabel("Due date").fill("2026-12-20");
    await page.getByRole("button", { name: "Create project" }).click();
    await page.waitForURL(/\/projects\/proj_added_\d+$/);
    const createdPath = new URL(page.url()).pathname;
    await page.getByRole("heading", { name: CREATED_NAME }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: CREATED_NAME }).waitFor();

    await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: CREATED_NAME, exact: true }).first().waitFor();
    await page.goto(`${BASE_URL}/clients/cl_harbor_thistle/projects`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: CREATED_NAME, exact: true }).first().waitFor();
    await page.goto(`${BASE_URL}${createdPath}`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Summarize" }).click();
    const aiDialog = page.getByRole("dialog");
    await aiDialog.getByText(CREATED_NAME, { exact: false }).first().waitFor();
    await aiDialog.getByRole("button", { name: "Close" }).click();

    // Existing-project edit must cross the action/render bundle boundary too.
    await page.goto(`${BASE_URL}/projects/proj_harbor_refresh/edit`, { waitUntil: "networkidle" });
    await page.getByLabel("Name").fill(EDITED_NAME);
    await page.getByRole("button", { name: "Save changes" }).click();
    await page.waitForURL("**/projects/proj_harbor_refresh");
    await page.getByRole("heading", { name: EDITED_NAME }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("heading", { name: EDITED_NAME }).waitFor();
    await page.goto(`${BASE_URL}/projects`, { waitUntil: "networkidle" });
    await page.getByRole("link", { name: EDITED_NAME, exact: true }).first().waitFor();

    // A practical task mutation persists across a fresh request.
    await page.goto(`${BASE_URL}/tasks/task_harbor_refresh_01`, { waitUntil: "networkidle" });
    await page.getByLabel("Priority").selectOption("high");
    await page.waitForTimeout(250);
    await page.reload({ waitUntil: "networkidle" });
    assert.equal(await page.getByLabel("Priority").inputValue(), "high");

    // Preferences alter the derived feed across navigation and refresh.
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    const initialNotificationLabel = await page.getByRole("button", { name: /^Notifications/ }).getAttribute("aria-label");
    const initialUnread = Number(initialNotificationLabel?.match(/(\d+) unread/)?.[1] ?? 0);
    assert.ok(initialUnread > 0, "expected unread notifications at baseline");
    await page.goto(`${BASE_URL}/settings/notifications`, { waitUntil: "networkidle" });
    const riskToggle = page.getByRole("switch", { name: "Project risk alerts" });
    assert.equal(await riskToggle.isChecked(), true);
    await riskToggle.click();
    await page.waitForTimeout(250);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    const filteredLabel = await page.getByRole("button", { name: /^Notifications/ }).getAttribute("aria-label");
    const filteredUnread = Number(filteredLabel?.match(/(\d+) unread/)?.[1] ?? 0);
    assert.ok(filteredUnread < initialUnread, "preference should reduce the derived notification feed");
    await page.reload({ waitUntil: "networkidle" });
    const refreshedFilteredLabel = await page.getByRole("button", { name: /^Notifications/ }).getAttribute("aria-label");
    assert.equal(refreshedFilteredLabel, filteredLabel);

    // Read state persists through close/reopen and a full refresh.
    await page.getByRole("button", { name: /^Notifications/ }).click();
    await page.getByRole("button", { name: "Mark all read" }).click();
    await page.waitForTimeout(250);
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "Notifications", exact: true }).waitFor();
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Notifications", exact: true }).waitFor();
    await page.getByRole("button", { name: "Notifications", exact: true }).click();
    assert.equal(await page.getByRole("button", { name: "Mark all read" }).isDisabled(), true);
    await page.getByRole("dialog").getByRole("button", { name: "Close" }).click();

    // One reset restores projects, tasks, preferences, and read state.
    await reset(page);
    const missingResponse = await page.goto(`${BASE_URL}${createdPath}`, { waitUntil: "networkidle" });
    assert.equal(missingResponse?.status(), 404);
    await page.goto(`${BASE_URL}/projects/proj_harbor_refresh`, { waitUntil: "networkidle" });
    await page.getByRole("heading", { name: "Brand Refresh", exact: true }).waitFor();
    await page.goto(`${BASE_URL}/tasks/task_harbor_refresh_01`, { waitUntil: "networkidle" });
    assert.equal(await page.getByLabel("Priority").inputValue(), "medium");
    await page.goto(`${BASE_URL}/settings/notifications`, { waitUntil: "networkidle" });
    assert.equal(await page.getByRole("switch", { name: "Project risk alerts" }).isChecked(), true);
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    const resetLabel = await page.getByRole("button", { name: /^Notifications/ }).getAttribute("aria-label");
    assert.ok(/\d+ unread/.test(resetLabel ?? ""), "reset should restore unread notifications");

    // Expired sessions get a visible action-aware redirect, not a silent no-op.
    await page.goto(`${BASE_URL}/projects/new`, { waitUntil: "networkidle" });
    await page.getByLabel("Name").fill("Must not be created");
    await context.clearCookies();
    await page.getByRole("button", { name: "Create project" }).click();
    await page.waitForURL("**/login?reason=session-expired");
    await page.getByText("Your demo session ended.", { exact: false }).waitFor();

    console.log("[pass] production Server Actions share state with subsequent renders, refreshes, related routes, AI, and reset");
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
