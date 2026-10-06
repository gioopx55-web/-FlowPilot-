# QA harness

Small, dev-only Playwright scripts (Phase 21.1 §15/§16, `DECISIONS.md` D-098) — not a test framework, not CI-wired. Each script drives a real Chromium browser against a running build and exits non-zero on a real finding.

## Setup (once)

```bash
npm install
npx playwright install chromium
```

## Running

Start the app first (a production build is the most representative target):

```bash
npm run build
npm run start &        # or: npm run dev &
```

Then run any of:

```bash
npm run qa:axe          # accessibility sweep, light + dark, 15 routes
npm run qa:responsive   # horizontal-overflow + panel-docking sweep, 6 viewports
npm run qa:rtl          # RTL overflow + Sidebar-docking sweep, 5 routes
npm run qa:all          # all three in sequence
```

Override the target with `QA_BASE_URL` (default `http://localhost:3000`), e.g.:

```bash
QA_BASE_URL=http://localhost:3101 npm run qa:axe
```

## What's covered

The route matrix lives in `routes.mjs` — update it there, not per-script, so all three scripts stay in sync. `axe.mjs` uses `axe-core` via plain Node resolution against the copy already present transitively (through `eslint-plugin-jsx-a11y`/`eslint-config-next`) rather than a second declared dependency; if that ever stops resolving, the script fails loudly rather than silently skipping.
