import { notFound } from "next/navigation";
import { ListChecks } from "lucide-react";
import { getDemoDataset } from "@/data/mock";
import { ComingSoon } from "@/components/primitives/ComingSoon";

/**
 * Thin placeholder (Phase 8) so links from the Project Tasks tab
 * resolve instead of 404ing — full Task Detail is Phase 9 scope. The
 * taskId is validated against real data so a genuinely broken link
 * still 404s rather than being masked by a generic placeholder.
 */
export default async function TaskDetailPlaceholder({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const task = getDemoDataset().tasks.find((t) => t.id === taskId);
  if (!task) notFound();

  return (
    <div className="flex h-full items-center justify-center">
      <ComingSoon
        icon={ListChecks}
        title={task.title}
        description="Full task detail ships in a later phase."
      />
    </div>
  );
}
