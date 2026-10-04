import type { Client, ClientInteraction } from "@/types/entities";
import { getLatestClientInteraction } from "@/domain/clients/followUp";

/**
 * The one controlled process allowed to populate `Client.lastInteractionAt`
 * (PROJECT_PLAN.md §13.8/§13.24/§13.25 rule 3). Fixture authors never set
 * this field directly on a Client record — it is always recomputed here
 * from ClientInteraction data, once, when the dataset is assembled
 * (data/mock/index.ts). No other code should write this field.
 */
export function withDerivedClientFields(
  client: Client,
  interactions: ClientInteraction[],
): Client {
  const latest = getLatestClientInteraction(client.id, interactions);
  return {
    ...client,
    lastInteractionAt: latest?.occurredAt,
  };
}
