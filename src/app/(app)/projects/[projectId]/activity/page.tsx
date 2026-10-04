import { ProjectActivityTab } from "@/components/projects/ProjectActivityTab";

export default async function ProjectActivityPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectActivityTab projectId={projectId} />;
}
