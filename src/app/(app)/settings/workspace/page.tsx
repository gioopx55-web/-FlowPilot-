import { getDemoDataset } from "@/data/mock";
import { Section } from "@/components/primitives/Section";
import { formatShortDate } from "@/lib/format";

/**
 * Workspace settings (Phase 14 §10) — display only. The brief asks
 * to "show" workspace identity, not necessarily edit it, and nothing
 * in the product currently needs a renameable workspace — kept
 * read-only rather than adding a mutation surface nothing requires.
 */
export default function WorkspaceSettingsPage() {
  const { workspace, teamMembers, clients, projects } = getDemoDataset();

  return (
    <Section title="Workspace">
      <dl className="max-w-md space-y-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Workspace name</dt>
          <dd className="text-foreground">{workspace.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Created</dt>
          <dd className="text-foreground">{formatShortDate(workspace.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Workspace size</dt>
          <dd className="text-foreground">
            {teamMembers.length} team members · {clients.length} clients · {projects.length}{" "}
            projects
          </dd>
        </div>
      </dl>
      <p className="mt-4 max-w-md text-xs text-muted-foreground">
        This is a demo workspace — renaming it, domains, and SSO aren&apos;t part of V1.
      </p>
    </Section>
  );
}
