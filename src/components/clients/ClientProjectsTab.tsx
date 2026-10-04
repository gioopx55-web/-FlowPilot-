import { FolderKanban } from "lucide-react";
import { getClientProjectsWithRisk } from "@/domain/selectors";
import { requireClient } from "@/components/clients/requireClient";
import { ProjectsTable } from "@/components/projects/ProjectsTable";
import { EmptyState } from "@/components/primitives/EmptyState";

/**
 * Client-scoped Projects tab (Phase 10 §6). Reuses the global
 * ProjectsTable (with showClient=false, since the client is already
 * the scoping context) and getClientProjectsWithRisk — no duplicated
 * project data or risk computation.
 */
export function ClientProjectsTab({ clientId }: { clientId: string }) {
  requireClient(clientId);
  const entries = getClientProjectsWithRisk(clientId);

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Projects for this client will show up here once they exist."
      />
    );
  }

  return <ProjectsTable entries={entries} showClient={false} />;
}
