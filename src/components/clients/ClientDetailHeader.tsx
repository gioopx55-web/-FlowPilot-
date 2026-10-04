import Link from "next/link";
import type { Client } from "@/types/entities";
import type { ClientFollowUpStatus } from "@/domain/clients/followUp";
import { Badge } from "@/components/primitives/Badge";
import { FollowUpBadge } from "@/components/primitives/FollowUpBadge";
import { Button } from "@/components/ui/button";
import { CLIENT_STATUS_LABEL } from "@/components/clients/clientLabels";

const linkClassName =
  "rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Persistent Client Detail header (Phase 10 §4) — shared across all
 * tabs via the route layout. Follow-up comes in pre-computed
 * (getClientFollowUpStatus already ran); this component never
 * compares dates itself (Phase 10 §3).
 */
export function ClientDetailHeader({
  client,
  followUp,
}: {
  client: Client;
  followUp: ClientFollowUpStatus;
}) {
  return (
    <header className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/clients" className={linkClassName}>
          Clients
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{client.name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground">{client.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
            <span>{client.primaryContactName}</span>
            {client.primaryContactEmail && (
              <>
                <span aria-hidden="true">·</span>
                {/* dir="ltr" keeps the email's @/./- characters in their
                    natural left-to-right order even when the page is RTL
                    (Phase 10 §18) — the surrounding bidi algorithm would
                    otherwise visually scramble a technical token like this. */}
                <span dir="ltr" className="[unicode-bidi:isolate]">
                  {client.primaryContactEmail}
                </span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <Badge tone="neutral">{CLIENT_STATUS_LABEL[client.status]}</Badge>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <FollowUpBadge followUp={followUp} />
          <Button asChild variant="outline" size="sm">
            <Link href={`/clients/${client.id}/interactions`}>Add interaction</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
