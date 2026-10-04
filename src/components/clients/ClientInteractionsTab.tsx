import { MessageSquare } from "lucide-react";
import { getClientInteractionHistory } from "@/domain/selectors";
import { requireClient } from "@/components/clients/requireClient";
import { AddInteractionForm } from "@/components/clients/AddInteractionForm";
import { EmptyState } from "@/components/primitives/EmptyState";
import { INTERACTION_TYPE_LABEL } from "@/components/clients/clientLabels";
import { formatShortDate } from "@/lib/format";

/**
 * Client-scoped Interactions tab (Phase 10 §9-§10).
 * ClientInteraction is the one source of truth here — newest first,
 * via getClientInteractionHistory, no separate ordering logic.
 */
export function ClientInteractionsTab({ clientId }: { clientId: string }) {
  requireClient(clientId);
  const interactions = getClientInteractionHistory(clientId);

  return (
    <div className="space-y-6">
      <AddInteractionForm clientId={clientId} />

      {interactions.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No interactions logged yet"
          description="Calls, emails, meetings, and notes for this client will show up here."
        />
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {interactions.map((interaction) => (
            <li key={interaction.id} className="flex flex-col gap-1 p-4">
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span>{INTERACTION_TYPE_LABEL[interaction.type]}</span>
                <time dateTime={interaction.occurredAt}>
                  {formatShortDate(interaction.occurredAt)}
                </time>
              </div>
              <p className="text-sm text-foreground">{interaction.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
