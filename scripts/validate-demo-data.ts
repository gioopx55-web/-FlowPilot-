/**
 * Dev-time validation entry point for the Phase 6 mock dataset. Run
 * via `npm run validate:data`. Exits non-zero with every problem
 * listed if the dataset is invalid — intended to be useful to a
 * developer, not just a pass/fail flag.
 */
import { getDemoDataset } from "@/data/mock/index";

try {
  const ds = getDemoDataset();
  console.log("Demo dataset is valid.");
  console.log(
    `  workspace=1 users=${ds.users.length} teamMembers=${ds.teamMembers.length} ` +
      `clients=${ds.clients.length} clientInteractions=${ds.clientInteractions.length} ` +
      `projects=${ds.projects.length} tasks=${ds.tasks.length} ` +
      `activities=${ds.activities.length} notifications=${ds.notifications.length}`,
  );
  process.exit(0);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
