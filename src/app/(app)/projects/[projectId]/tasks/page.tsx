import { ProjectTasksTab } from "@/components/projects/ProjectTasksTab";

export default async function ProjectTasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectTasksTab projectId={projectId} />;
}
