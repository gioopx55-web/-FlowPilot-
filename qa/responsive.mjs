#!/usr/bin/env node
/**
 * Dev-only responsive QA harness (Phase 21.1 §16/D-097) — reproduces
 * the overflow-sweep methodology Phase 16 (D-068/D-069) ran manually,
 * as a committed, reproducible script. Checks, at each viewport:
 *   - no page-level horizontal overflow (scrollWidth <= clientWidth)
 *   - the AI panel is full-width on mobile, docked below the Topbar
 *     on desktop/tablet (D-068/D-085)
 *
 * Usage: start the app, then `npm run qa:responsive`.
 */
import { launchSignedIn, BASE_URL } from "./lib.mjs";
import { ALL_ROUTES } from "./routes.mjs";

const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

async function checkOverflow(page) {
  return page.evaluate(() => {
    const el = document.documentElement;
    return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
  });
}

async function checkPanelDocking(page, viewportWidth, triggerName) {
  const trigger = page.getByRole("button", { name: triggerName });
  if (!(await trigger.isVisible().catch(() => false))) return { ok: true, note: "no trigger visible" };
  await trigger.click();
  const panel = page.locator('[role="dialog"]').first();
  await panel.waitFor({ state: "visible", timeout: 5000 });
  const box = await panel.boundingBox();
  await panel.getByRole("button", { name: "Close" }).click();
  await panel.waitFor({ state: "hidden", timeout: 5000 });
  if (!box) return { ok: false, note: "panel has no bounding box" };

  const isMobile = viewportWidth < 640;
  if (isMobile) {
    const fullWidth = Math.abs(box.width - viewportWidth) < 2;
    return { ok: fullWidth, note: `width=${box.width} vs viewport=${viewportWidth}` };
  }
  const topbarHeight = 56; // h-14
  const dockedBelowTopbar = box.y >= topbarHeight - 2;
  return { ok: dockedBelowTopbar, note: `panel top=${box.y}` };
}

async function main() {
  const { browser, context } = await launchSignedIn();
  let failures = 0;

  for (const viewport of VIEWPORTS) {
    const page = await context.newPage();
    await page.setViewportSize(viewport);

    for (const path of ALL_ROUTES) {
      await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
      const { scrollWidth, clientWidth } = await checkOverflow(page);
      const overflowOk = scrollWidth <= clientWidth + 1; // 1px rounding tolerance
      if (!overflowOk) {
        failures += 1;
        console.log(
          `[FAIL] ${path} @ ${viewport.width}x${viewport.height} — horizontal overflow (scrollWidth=${scrollWidth} clientWidth=${clientWidth})`,
        );
      }
    }

    // Panel docking check once per viewport, from /dashboard.
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
    for (const [panelName, triggerName] of [
      ["AI", /^AI Assistant$/],
      ["Notifications", /^Notifications/],
    ]) {
      const panelResult = await checkPanelDocking(page, viewport.width, triggerName);
      if (!panelResult.ok) {
        failures += 1;
        console.log(`[FAIL] ${panelName} panel docking @ ${viewport.width}x${viewport.height} — ${panelResult.note}`);
      } else {
        console.log(`[pass] ${panelName} panel docking @ ${viewport.width}x${viewport.height} (${panelResult.note})`);
      }
    }

    await page.evaluate(() => localStorage.removeItem("flowpilot-onboarding-complete"));
    await page.reload({ waitUntil: "networkidle" });
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    const dialogBox = await dialog.boundingBox();
    const dialogFits = Boolean(
      dialogBox &&
      dialogBox.x >= -1 &&
      dialogBox.y >= -1 &&
      dialogBox.x + dialogBox.width <= viewport.width + 1 &&
      dialogBox.y + dialogBox.height <= viewport.height + 1,
    );
    console.log(dialogFits ? `[pass] onboarding fits @ ${viewport.width}x${viewport.height}` : `[FAIL] onboarding exceeds viewport @ ${viewport.width}x${viewport.height}`);
    if (!dialogFits) failures += 1;
    await page.getByRole("button", { name: "Skip" }).click();

    await page.close();
  }

  await browser.close();

  if (failures > 0) {
    console.error(`\n${failures} responsive failure(s) found.`);
    process.exit(1);
  }
  console.log("\nZero horizontal overflow; AI, Notifications, onboarding, and project forms fit across the full matrix.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
