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

export type { DemoDataset };
export { WORKSPACE_ID };

let cached: DemoDataset | undefined;

/**
 * Builds (once) and returns the full composed demo dataset. This is
 * the single place `Client.lastInteractionAt` gets attached (via
 * `withDerivedClientFields`) and the single place the dataset is
 * validated. Every domain selector reads through this function —
 * never the raw per-entity fixture modules directly — so there is
 * exactly one assembled, validated dataset in memory.
 *
 * Throws on invalid data: an invalid mock dataset is a build-time bug,
 * not a recoverable runtime condition, so this fails loudly rather
 * than letting bad data silently reach a future feature.
 */
export function getDemoDataset(): DemoDataset {
  if (cached) return cached;

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

  cached = dataset;
  return dataset;
}
