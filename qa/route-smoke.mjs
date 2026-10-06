#!/usr/bin/env node
import assert from "node:assert/strict";
import { launchSignedIn, BASE_URL } from "./lib.mjs";
import { SMOKE_ROUTES } from "./routes.mjs";

async function main() {
  const { browser, context } = await launchSignedIn();
  const page = await context.newPage();

  try {
    for (const path of SMOKE_ROUTES) {
      const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 200, `${path} should return 200`);
      console.log(`[pass] ${path} — 200`);
    }

    for (const path of [
      "/projects/not-a-project",
      "/tasks/not-a-task",
      "/clients/not-a-client",
      "/team/not-a-member",
    ]) {
      const response = await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
      assert.equal(response?.status(), 404, `${path} should return a real 404`);
      console.log(`[pass] ${path} — 404`);
    }
  } finally {
    await browser.close();
  }

  console.log("\nAll implemented routes return 200 and representative missing records return 404.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
