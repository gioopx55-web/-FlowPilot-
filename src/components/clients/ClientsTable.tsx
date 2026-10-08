import Link from "next/link";
import { Users } from "lucide-react";
import type { ClientListEntry } from "@/domain/selectors";
import { Badge } from "@/components/primitives/Badge";
import { FollowUpBadge } from "@/components/primitives/FollowUpBadge";
import { EmptyState } from "@/components/primitives/EmptyState";
import { CLIENT_STATUS_LABEL } from "@/components/clients/clientLabels";

/**
 * Dense client list (Phase 10 §1) — same dual table/stacked-list
 * rendering pattern as ProjectsTable/TasksTable, built responsive
 * from the start.
 */
export function ClientsTable({ entries }: { entries: ClientListEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No clients match your filters"
        description="Try a different search term or clear your filters."
      />
    );
  }

  return (
    <>
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Client</th>
            <th className="px-3 py-2 text-start font-medium">Primary contact</th>
            <th className="px-3 py-2 text-start font-medium">Status</th>
            <th className="px-3 py-2 text-start font-medium">Active projects</th>
            <th className="px-3 py-2 text-start font-medium">Follow-up</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(({ client, followUp, activeProjectCount, atRiskProjectCount }) => (
            <tr key={client.id} className="hover:bg-accent">
              <td className="px-3 py-2.5">
                <Link
                  href={`/clients/${client.id}`}
                  className="font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {client.name}
                </Link>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {client.primaryContactName}
              </td>
              <td className="px-3 py-2.5">
                <Badge tone="neutral">{CLIENT_STATUS_LABEL[client.status]}</Badge>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {activeProjectCount}
                {atRiskProjectCount > 0 && (
                  <span className="text-[var(--fp-warning)]"> ({atRiskProjectCount} at risk)</span>
                )}
              </td>
              <td className="px-3 py-2.5">
                <FollowUpBadge followUp={followUp} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-border rounded-md border border-border md:hidden">
        {entries.map(({ client, followUp, activeProjectCount, atRiskProjectCount }) => (
          <li key={client.id} className="flex flex-col gap-2 p-3">
            <Link
              href={`/clients/${client.id}`}
              className="outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              <span className="block text-sm font-medium text-foreground hover:underline">
                {client.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {client.primaryContactName} · {activeProjectCount} active project
                {activeProjectCount === 1 ? "" : "s"}
                {atRiskProjectCount > 0 && (
                  <span className="text-[var(--fp-warning)]"> ({atRiskProjectCount} at risk)</span>
                )}
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="neutral">{CLIENT_STATUS_LABEL[client.status]}</Badge>
              <FollowUpBadge followUp={followUp} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
