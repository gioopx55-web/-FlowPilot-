import { workspace, WORKSPACE_ID } from "@/data/mock/workspace";
import { users } from "@/data/mock/users";
import { teamMembers } from "@/data/mock/team-members";
import { clients as rawClients } from "@/data/mock/clients";
import { clientInteractions } from "@/data/mock/client-interactions";
import { projects } from "@/data/mock/projects";
import { tasks } from "@/data/mock/tasks";
import { activities } from "@/data/mock/activities";
import { notifications } from "@/data/mock/notifications";
import { withDerivedClientFields } from "@/domain/clients/deriveClientFields";
import { validateDemoDataset, type DemoDataset } from "@/domain/validation";
import { applyTaskOverride } from "@/domain/taskMutations";
import { applyClientOverride, getAddedInteractions } from "@/domain/clientMutations";
import { applyUserOverride } from "@/domain/settingsMutations";

export type { DemoDataset };
export { WORKSPACE_ID };

let cachedBase: DemoDataset | undefined;

/**
 * Builds (once) and validates the BASE demo dataset — the Phase 6
 * fixtures exactly as authored, before any Phase 9 task edits are
 * applied. This is the single place `Client.lastInteractionAt` gets
 * attached and the single place full dataset validation runs (task
 * overrides are per-field edits, validated individually at the
 * mutation boundary in domain/taskMutations.ts, not re-run through
 * the full fixture-coverage validator on every edit).
 *
 * Throws on invalid BASE data: an invalid mock dataset is a
 * build-time bug, not a recoverable runtime condition.
 */
function getBaseDataset(): DemoDataset {
  if (cachedBase) return cachedBase;

  const clients = rawClients.map((client) =>
    withDerivedClientFields(client, clientInteractions),
  );

  const dataset: DemoDataset = {
    workspace,
    users,
    teamMembers,
    clients,
    clientInteractions,
    projects,
    tasks,
    activities,
    notifications,
  };

  const { errors } = validateDemoDataset(dataset);
  if (errors.length > 0) {
    throw new Error(
      `Invalid demo dataset (${errors.length} issue(s)):\n- ${errors.join("\n- ")}`,
    );
  }

  cachedBase = dataset;
  return dataset;
}

/**
 * Returns the demo dataset with any Phase 9 task overrides and Phase
 * 10 client overrides/added interactions applied — the ONE function
 * every selector/page reads through. Never returns a stale snapshot:
 * everything is layered on fresh on every call (cheap at this
 * dataset size), so a mutation is visible to the very next read, from
 * any page, with no cache invalidation to manage.
 *
 * `lastInteractionAt` is re-derived here (not just at base-build
 * time) using the FULL interaction list — base fixtures plus any
 * added via "Add interaction" — so it stays correct after a mutation
 * without a second derivation path (Phase 10 §3/§8).
 */
export function getDemoDataset(): DemoDataset {
  const base = getBaseDataset();
  const clientInteractions = [...base.clientInteractions, ...getAddedInteractions()];
  const clients = base.clients.map((client) =>
    withDerivedClientFields(applyClientOverride(client), clientInteractions),
  );
  return {
    ...base,
    users: base.users.map(applyUserOverride),
    tasks: base.tasks.map(applyTaskOverride),
    clients,
    clientInteractions,
  };
}
