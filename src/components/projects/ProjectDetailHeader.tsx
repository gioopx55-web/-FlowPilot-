import Link from "next/link";
import type { Client, Project } from "@/types/entities";
import type { ProjectRiskResult } from "@/domain/risk/risk";
import { RiskBadge } from "@/components/primitives/RiskBadge";
import { ProjectAIActions } from "@/components/ai/ProjectAIActions";
import { formatShortDate } from "@/lib/format";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";

const linkClassName =
  "rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Persistent Project Detail header (Phase 8 §3) — shared across all
 * four tabs via the route layout. Risk comes in as an already-computed
 * ProjectRiskResult; this component never calls computeProjectRisk
 * itself (One Source of Truth, Constitution §7).
 */
export function ProjectDetailHeader({
  project,
  client,
  risk,
}: {
  project: Project;
  client: Client | undefined;
  risk: ProjectRiskResult;
}) {
  return (
    <header className="border-b border-border px-4 py-4 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/projects" className={linkClassName}>
          Projects
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{project.name}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-foreground">{project.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground">
            {client ? (
              <Link href={`/clients/${client.id}`} className={linkClassName}>
                {client.name}
              </Link>
            ) : (
              <span>Unknown client</span>
            )}
            <span aria-hidden="true">·</span>
            <span>{PROJECT_STATUS_LABEL[project.status]}</span>
            <span aria-hidden="true">·</span>
            <span>{project.progressPct}% complete</span>
            {project.dueDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>due {formatShortDate(project.dueDate)}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge risk={risk} />
          <ProjectAIActions projectId={project.id} />
        </div>
      </div>
    </header>
  );
}
