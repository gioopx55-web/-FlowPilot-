import { ProjectTasksTab } from "@/components/projects/ProjectTasksTab";
import type { SearchParams } from "@/components/tasks/parseTaskSearchParams";

export default async function ProjectTasksPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { projectId } = await params;
  const sp = await searchParams;
  return <ProjectTasksTab projectId={projectId} searchParams={sp} />;
}
