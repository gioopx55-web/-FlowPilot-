import { getClientProjectsWithRisk, getClientInteractionHistory } from "@/domain/selectors";
import { requireClient } from "@/components/clients/requireClient";
import { Section } from "@/components/primitives/Section";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { formatShortDate } from "@/lib/format";

/**
 * Client Overview tab (Phase 10 §5) — a lightweight landing summary,
 * same role as Project Overview: short Projects and Interactions
 * summaries that link into their own full tabs, reusing the same
 * selectors those tabs use (no duplicated project/interaction data
 * or risk computation here).
 */
export function ClientOverview({ clientId }: { clientId: string }) {
  requireClient(clientId);
  const projectEntries = getClientProjectsWithRisk(clientId);
  const interactions = getClientInteractionHistory(clientId);
  const atRiskCount = projectEntries.filter((e) => e.risk.level !== "none").length;

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <Section
        title="Projects"
        action={{ label: "View projects", href: `/clients/${clientId}/projects` }}
      >
        <dl className="mb-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-base font-semibold text-foreground">{projectEntries.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">At risk</dt>
            <dd className="text-base font-semibold text-foreground">{atRiskCount}</dd>
          </div>
        </dl>
        {projectEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects for this client yet.</p>
        ) : (
          <ul className="space-y-1.5 text-sm">
            {projectEntries.slice(0, 5).map(({ project, risk }) => (
              <li key={project.id} className="flex items-center justify-between gap-4">
                <span className="truncate text-foreground">{project.name}</span>
                <RiskBadge risk={risk} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        title="Interactions"
        action={{ label: "View interactions", href: `/clients/${clientId}/interactions` }}
      >
        {interactions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No interactions logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {interactions.slice(0, 5).map((interaction) => (
              <li
                key={interaction.id}
                className="flex items-baseline justify-between gap-4 text-xs"
              >
                <span className="truncate text-foreground">{interaction.summary}</span>
                <time
                  dateTime={interaction.occurredAt}
                  className="shrink-0 whitespace-nowrap text-muted-foreground"
                >
                  {formatShortDate(interaction.occurredAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
