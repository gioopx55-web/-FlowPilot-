import { getClientById, getProjectRisk } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { ProjectDetailHeader } from "@/components/projects/ProjectDetailHeader";
import { ProjectTabs } from "@/components/projects/ProjectTabs";

/**
 * Shared header + route-backed tabs for every /projects/:projectId/*
 * route (Phase 8 §3-§4). An unknown projectId resolves to the
 * route's not-found.tsx rather than crashing or rendering blank
 * (Phase 8 §12).
 */
export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = requireProject(projectId);

  const client = getClientById(project.clientId);
  const risk = getProjectRisk(projectId);

  return (
    <div>
      <ProjectDetailHeader project={project} client={client} risk={risk} />
      <ProjectTabs projectId={projectId} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
