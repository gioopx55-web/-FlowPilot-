#!/usr/bin/env node
/**
 * Dev-only RTL QA harness (Phase 21.1 §16/D-097). Same injected-`dir`
 * methodology every prior RTL pass in this project has used (D-065 —
 * there is no runtime locale switcher; `getLocale()` is English-only
 * in V1, RTL is verified by forcing `dir="rtl"` after load). Checks a
 * representative route set for horizontal overflow under RTL and
 * confirms the Sidebar visually docks to the inline-start (physically
 * right) side.
 */
import { launchSignedIn, BASE_URL } from "./lib.mjs";

const ROUTES = ["/", "/dashboard", "/tasks", "/clients", "/settings"];

async function forceRtl(page) {
  await page.evaluate(() => {
    document.documentElement.setAttribute("dir", "rtl");
  });
}

async function main() {
  const { browser, context } = await launchSignedIn();
  let failures = 0;

  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const path of ROUTES) {
    await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
    await forceRtl(page);
    await page.waitForTimeout(100);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (scrollWidth > clientWidth + 1) {
      failures += 1;
      console.log(`[FAIL] ${path} — horizontal overflow under RTL (scrollWidth=${scrollWidth})`);
    } else {
      console.log(`[pass] ${path} — no overflow under RTL`);
    }
  }

  // Sidebar should dock to the physical right under RTL (inline-start).
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
  await forceRtl(page);
  await page.waitForTimeout(100);
  const sidebar = page.locator("aside").first();
  const sidebarBox = await sidebar.boundingBox();
  const viewportWidth = page.viewportSize().width;
  if (sidebarBox) {
    const docksRight = sidebarBox.x + sidebarBox.width > viewportWidth - 20;
    console.log(docksRight ? "[pass] Sidebar docks right under RTL" : "[FAIL] Sidebar did not dock right under RTL");
    if (!docksRight) failures += 1;
  }

  await browser.close();

  if (failures > 0) {
    console.error(`\n${failures} RTL failure(s) found.`);
    process.exit(1);
  }
  console.log("\nZero RTL overflow/layout failures across the route matrix.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
