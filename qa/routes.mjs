/**
 * The representative route matrix every QA script in this folder
 * audits (Phase 21.1 §15/§16/D-097) — one shared list so axe.mjs,
 * responsive.mjs, and rtl.mjs can never silently drift apart on
 * coverage.
 */
export const PUBLIC_ROUTES = ["/", "/login"];

export const APP_ROUTES = [
  "/dashboard",
  "/projects",
  "/projects/new",
  "/projects/proj_harbor_refresh",
  "/projects/proj_harbor_refresh/edit",
  "/tasks",
  "/tasks/task_harbor_refresh_01",
  "/clients",
  "/clients/cl_harbor_thistle",
  "/team",
  "/team/tm_maya",
  "/analytics",
  "/settings",
];

export const ALL_ROUTES = [...PUBLIC_ROUTES, ...APP_ROUTES];

/** Every implemented page route, used by the production route smoke test. */
export const SMOKE_ROUTES = [
  ...ALL_ROUTES,
  "/projects/proj_harbor_refresh/tasks",
  "/projects/proj_harbor_refresh/team",
  "/projects/proj_harbor_refresh/activity",
  "/clients/cl_harbor_thistle/projects",
  "/clients/cl_harbor_thistle/interactions",
  "/settings/workspace",
  "/settings/appearance",
  "/settings/notifications",
  "/settings/billing",
];
