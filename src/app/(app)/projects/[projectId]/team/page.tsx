import { ProjectTeamTab } from "@/components/projects/ProjectTeamTab";

export default async function ProjectTeamPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  return <ProjectTeamTab projectId={projectId} />;
}
