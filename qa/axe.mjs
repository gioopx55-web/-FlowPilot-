#!/usr/bin/env node
/**
 * Dev-only accessibility QA harness (Phase 21.1 §15/D-097) — the
 * independent Phase 21 audit could not reproduce the project's
 * earlier axe sweeps (Phase 17, D-070) because nothing in the repo
 * committed a reproducible way to run one. This closes that gap.
 *
 * Reuses `axe-core` via plain Node module resolution rather than
 * declaring it as a new dependency — it is already present
 * transitively (via `eslint-plugin-jsx-a11y`/`eslint-config-next`,
 * same reuse this project's Phase 17 audit already relied on, D-070).
 * If a future `eslint-config-next` upgrade ever drops it, this script
 * fails loudly with a clear message rather than silently skipping.
 *
 * Usage (see package.json's "qa:axe" script):
 *   npm run build && npm run start &  (or: npm run dev &)
 *   npm run qa:axe
 *
 * QA_BASE_URL overrides the default http://localhost:3000.
 * Exits non-zero if any route has a "serious" or "critical" violation.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { launchSignedIn, BASE_URL } from "./lib.mjs";
import { ALL_ROUTES } from "./routes.mjs";

const require = createRequire(import.meta.url);

let axeSource;
try {
  axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
} catch {
  console.error(
    "axe-core is not resolvable in node_modules. It is normally present transitively " +
      "via eslint-config-next. Run `npm install` and retry, or see DECISIONS.md D-097.",
  );
  process.exit(1);
}

const FAIL_IMPACTS = new Set(["serious", "critical"]);

async function auditRoute(context, path, colorScheme) {
  const page = await context.newPage();
  await page.emulateMedia({ colorScheme });
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle" });
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => await window.axe.run());
  await page.close();
  return results.violations;
}

async function main() {
  const { browser, context } = await launchSignedIn();
  let failures = 0;

  for (const path of ALL_ROUTES) {
    for (const colorScheme of ["light", "dark"]) {
      const violations = await auditRoute(context, path, colorScheme);
      const serious = violations.filter((v) => FAIL_IMPACTS.has(v.impact));
      const status = serious.length > 0 ? "FAIL" : "pass";
      console.log(`[${status}] ${path} (${colorScheme}) — ${violations.length} violation(s)`);
      for (const v of serious) {
        failures += 1;
        console.log(`    ${v.impact}: ${v.id} — ${v.help} (${v.nodes.length} node(s))`);
      }
    }
  }

  await browser.close();

  if (failures > 0) {
    console.error(`\n${failures} serious/critical axe violation(s) found.`);
    process.exit(1);
  }
  console.log("\nZero serious/critical axe violations across the full route matrix.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
