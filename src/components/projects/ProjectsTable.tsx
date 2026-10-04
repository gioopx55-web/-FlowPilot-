import Link from "next/link";
import type { ProjectListEntry } from "@/domain/selectors";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { Badge } from "@/components/primitives/Badge";
import { formatShortDate } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";

/**
 * Dense project list (Phase 8 §1). Two renderings of the same data,
 * switched purely by CSS (no viewport-detection JS, no SSR/hydration
 * mismatch risk): a real <table> at md+ and a stacked list below it —
 * same lesson as Phase 7's AtRiskProjects row-squeeze bug, avoided
 * here from the start rather than fixed after the fact.
 */
export function ProjectsTable({ entries }: { entries: ProjectListEntry[] }) {
  return (
    <>
      {/* Desktop/tablet: dense table (Phase 4 §15.21) */}
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="border-b border-border text-start text-xs text-muted-foreground">
            <th className="px-3 py-2 text-start font-medium">Project</th>
            <th className="px-3 py-2 text-start font-medium">Client</th>
            <th className="px-3 py-2 text-start font-medium">Status</th>
            <th className="px-3 py-2 text-start font-medium">Progress</th>
            <th className="px-3 py-2 text-start font-medium">Due</th>
            <th className="px-3 py-2 text-start font-medium">Risk</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map(({ project, risk, client }) => (
            <tr key={project.id} className="hover:bg-accent">
              <td className="px-3 py-2.5">
                <Link
                  href={`/projects/${project.id}`}
                  className="font-medium text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                >
                  {project.name}
                </Link>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {client?.name ?? "Unknown client"}
              </td>
              <td className="px-3 py-2.5">
                <Badge tone="neutral">{PROJECT_STATUS_LABEL[project.status]}</Badge>
              </td>
              <td className="px-3 py-2.5 text-muted-foreground">{project.progressPct}%</td>
              <td className="px-3 py-2.5 text-muted-foreground">
                {formatShortDate(project.dueDate)}
              </td>
              <td className="px-3 py-2.5">
                <RiskBadge risk={risk} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: stacked list */}
      <ul className="divide-y divide-border rounded-md border border-border md:hidden">
        {entries.map(({ project, risk, client }) => (
          <li key={project.id} className="flex flex-col gap-2 p-3">
            <Link
              href={`/projects/${project.id}`}
              className="outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              <span className="block text-sm font-medium text-foreground hover:underline">
                {project.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {client?.name ?? "Unknown client"} · {project.progressPct}% complete
                {project.dueDate && ` · due ${formatShortDate(project.dueDate)}`}
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="neutral">{PROJECT_STATUS_LABEL[project.status]}</Badge>
              <RiskBadge risk={risk} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
