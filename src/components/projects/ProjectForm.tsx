"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Project, ProjectStatus } from "@/types/entities";
import { createProjectAction, updateProjectAction } from "@/lib/projectActions";
import { PROJECT_STATUS_LABEL } from "@/components/projects/projectLabels";
import { Button } from "@/components/ui/button";

const STATUSES: ProjectStatus[] = ["kickoff", "in_progress", "review", "completed", "on_hold"];

const fieldClassName =
  "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

function toDateInputValue(iso: string | undefined): string {
  return iso ? iso.slice(0, 10) : "";
}

/**
 * Project create/edit form (Phase 21.1 §1) — a plain native controlled
 * form, same established precedent as AddInteractionForm.tsx/
 * TaskDetailContent.tsx (DECISIONS.md: React Hook Form + Zod judged
 * unjustified for a handful of fields with simple validation rules).
 * One component handles both create and edit — passed `project`
 * undefined for create, defined for edit — so there is exactly one
 * implementation of the field set, not two drifting copies.
 *
 * Only fields actually modeled on the `Project` entity are exposed
 * (name/client/status/progress/start+due date) — no invented
 * `priority`/`description` fields, since neither is modeled on
 * Project in `types/entities.ts` (those exist on `Task`, a different
 * entity). Server-side runtime validation (domain/projectMutations.ts)
 * is the authority; this form's own checks are a UX convenience only.
 */
export function ProjectForm({
  project,
  clientOptions,
  defaultStartDate,
}: {
  project?: Project;
  clientOptions: { id: string; name: string }[];
  defaultStartDate: string;
}) {
  const router = useRouter();
  const isEdit = project !== undefined;

  const [name, setName] = useState(project?.name ?? "");
  const [clientId, setClientId] = useState(project?.clientId ?? clientOptions[0]?.id ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "kickoff");
  const [progressPct, setProgressPct] = useState(project?.progressPct ?? 0);
  const [startDate, setStartDate] = useState(
    toDateInputValue(project?.startDate) || defaultStartDate,
  );
  const [dueDate, setDueDate] = useState(toDateInputValue(project?.dueDate));
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(undefined);

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }
    if (!clientId) {
      setError("Select a client.");
      return;
    }
    if (progressPct < 0 || progressPct > 100 || Number.isNaN(progressPct)) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateProjectAction(project.id, {
            name,
            clientId,
            status,
            progressPct,
            startDate,
            dueDate: dueDate || null,
          })
        : await createProjectAction({
            name,
            clientId,
            status,
            progressPct,
            startDate,
            dueDate: dueDate || null,
          });

      if (!result.ok) {
        setError(result.error ?? "Could not save this project.");
        return;
      }
      router.push(`/projects/${result.projectId ?? project?.id}`);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="project-name" className="mb-1 block text-xs text-muted-foreground">
          Name
        </label>
        <input
          id="project-name"
          className={fieldClassName}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={120}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="project-client" className="mb-1 block text-xs text-muted-foreground">
            Client
          </label>
          <select
            id="project-client"
            className={fieldClassName}
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            required
          >
            {clientOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project-status" className="mb-1 block text-xs text-muted-foreground">
            Status
          </label>
          <select
            id="project-status"
            className={fieldClassName}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUSES.filter((s) => isEdit || s !== "completed").map((s) => (
              <option key={s} value={s}>
                {PROJECT_STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="project-progress" className="mb-1 block text-xs text-muted-foreground">
            Progress (%)
          </label>
          <input
            id="project-progress"
            type="number"
            min={0}
            max={100}
            className={fieldClassName}
            value={progressPct}
            onChange={(e) => setProgressPct(Number(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="project-start" className="mb-1 block text-xs text-muted-foreground">
            Start date
          </label>
          <input
            id="project-start"
            type="date"
            className={fieldClassName}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="project-due" className="mb-1 block text-xs text-muted-foreground">
            Due date
          </label>
          <input
            id="project-due"
            type="date"
            className={fieldClassName}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="text-xs text-[var(--fp-critical)]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
