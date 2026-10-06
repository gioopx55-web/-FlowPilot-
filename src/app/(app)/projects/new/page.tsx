import { getClientsFiltered } from "@/domain/selectors";
import { demoToday } from "@/lib/demo-clock";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { PageHeader } from "@/components/primitives/PageHeader";

export const metadata = { title: "New Project — FlowPilot AI" };

export default function NewProjectPage() {
  const clientOptions = getClientsFiltered({}, "name").map((e) => ({
    id: e.client.id,
    name: e.client.name,
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader title="New Project" description="Add a project to the demo workspace." />
      <ProjectForm
        clientOptions={clientOptions}
        defaultStartDate={demoToday().toISOString().slice(0, 10)}
      />
    </div>
  );
}
