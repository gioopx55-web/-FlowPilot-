import { notFound } from "next/navigation";
import Link from "next/link";
import { getTaskDetail } from "@/domain/selectors";
import { getDemoDataset } from "@/data/mock";
import { TaskDetailContent } from "@/components/tasks/TaskDetailContent";

/**
 * Direct deep link (Phase 2 §11.10, Phase 9 §10): resolves to the
 * complete, fully usable Task Detail experience using the EXACT same
 * <TaskDetailContent> the panel renders — no separate implementation.
 * There is no underlying list here to preserve, so this renders as a
 * normal page with a breadcrumb back to Tasks, rather than a panel.
 */
export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const detail = getTaskDetail(taskId);
  if (!detail) notFound();

  const { teamMembers } = getDemoDataset();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link
          href="/tasks"
          className="rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
        >
          Tasks
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate text-foreground">{detail.task.title}</span>
      </nav>

      <TaskDetailContent detail={detail} teamMembers={teamMembers} />
    </div>
  );
}
