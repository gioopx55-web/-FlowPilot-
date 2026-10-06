import { getClientsFiltered } from "@/domain/selectors";
import { requireProject } from "@/components/projects/requireProject";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { demoToday } from "@/lib/demo-clock";

export const metadata = { title: "Edit Project — FlowPilot AI" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = requireProject(projectId);
  const clientOptions = getClientsFiltered({}, "name").map((e) => ({
    id: e.client.id,
    name: e.client.name,
  }));

  return (
    <ProjectForm
      project={project}
      clientOptions={clientOptions}
      defaultStartDate={demoToday().toISOString().slice(0, 10)}
    />
  );
}
