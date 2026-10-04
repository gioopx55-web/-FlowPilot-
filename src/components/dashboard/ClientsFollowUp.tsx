import Link from "next/link";
import { getClientsNeedingFollowUpSorted } from "@/domain/selectors";

/**
 * Clients Needing Follow-Up (Phase 7 §4). All date comparison lives
 * in domain/clients/followUp.ts (FOLLOW_UP_STALE_DAYS = 7, D-033) —
 * this component only renders the already-computed status. Dormant
 * clients never appear here (excluded inside the domain function).
 */
export function ClientsFollowUp() {
  const entries = getClientsNeedingFollowUpSorted();

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No clients need follow-up right now.</p>;
  }

  return (
    <ul className="divide-y divide-border rounded-md border border-border">
      {entries.map(({ client, status }) => (
        <li key={client.id} className="p-3">
          <Link
            href={`/clients/${client.id}`}
            className="outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <span className="block text-sm font-medium text-foreground hover:underline">
              {client.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {client.primaryContactName} ·{" "}
              {status.daysSinceLastInteraction !== undefined
                ? `${status.daysSinceLastInteraction} days since last contact`
                : "No interaction logged yet"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
