import Link from "next/link";
import type { TeamMemberWorkloadResult } from "@/domain/workload/workload";
import type { MemberWorkloadContributor } from "@/domain/selectors";
import { WorkloadBadge } from "@/components/primitives/WorkloadBadge";
import { formatShortDate } from "@/lib/format";

/**
 * Workload explanation (Phase 12 §8) — shown directly on the page,
 * not hidden behind `WorkloadBadge`'s own click-to-expand disclosure
 * (that stays too, for quick scanning elsewhere). For Overloaded/High
 * members especially, the numbers and the biggest contributing tasks
 * are visible at rest so the state is actionable without an extra
 * interaction.
 */
export function MemberWorkloadExplanation({
  workload,
  contributors,
}: {
  workload: TeamMemberWorkloadResult;
  contributors: MemberWorkloadContributor[];
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-3xl font-semibold text-foreground">
          {Math.round(workload.workloadPct)}%
        </p>
        <WorkloadBadge workload={workload} showPercent={false} />
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        {workload.assignedHours}h assigned of {workload.weeklyCapacityHours}h weekly capacity.
        {workload.fallbackTaskIds.length > 0 && (
          <>
            {" "}
            {workload.fallbackTaskIds.length} of {contributors.length} assigned task
            {contributors.length === 1 ? "" : "s"} used an estimated (fallback) hour value because
            no real estimate was set.
          </>
        )}
      </p>

      {contributors.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">
            Biggest contributors to this workload
          </h3>
          <ul className="space-y-1.5">
            {contributors.map((c) => (
              <li
                key={c.task.id}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="min-w-0 truncate">
                  <Link
                    href={`/tasks/${c.task.id}`}
                    className="rounded-sm text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
                  >
                    {c.task.title}
                  </Link>
                  {c.project && (
                    <span className="text-muted-foreground"> · {c.project.name}</span>
                  )}
                </span>
                <span className="shrink-0 whitespace-nowrap text-muted-foreground">
                  {c.hours}h{c.usedFallback ? " (est.)" : ""}
                  {c.task.dueDate && ` · ${formatShortDate(c.task.dueDate)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
