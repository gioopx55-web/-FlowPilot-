"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { TaskDetailEntry } from "@/domain/selectors";
import type { TaskPriority, TeamMember } from "@/types/entities";
import {
  changeTaskBlockerAction,
  updateTaskFieldsAction,
} from "@/lib/taskActions";
import { StatusSelect } from "@/components/tasks/StatusSelect";
import { formatShortDate } from "@/lib/format";

const selectClassName =
  "h-9 rounded-sm border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * The one Task Detail implementation (Phase 2 §11.10, Phase 9 §8-§9).
 * Rendered identically by the panel (opened over Tasks/Kanban/Project
 * Tasks via a `?task=` query param, preserving the underlying list)
 * and the direct `/tasks/:taskId` page — only the chrome around this
 * component differs, never its fields or behavior.
 *
 * Edits are optimistic (local state updates immediately) then sent to
 * the Phase 9 demo-state Server Actions (domain/taskMutations.ts);
 * see DECISIONS.md D-039 for the persistence model.
 */
export function TaskDetailContent({
  detail,
  teamMembers,
  pageHeading = false,
}: {
  detail: TaskDetailEntry;
  teamMembers: TeamMember[];
  pageHeading?: boolean;
}) {
  const [task, setTask] = useState(detail.task);
  const [, startTransition] = useTransition();

  const assignee = task.assigneeId
    ? teamMembers.find((m) => m.id === task.assigneeId)
    : undefined;

  function saveFields(edits: Parameters<typeof updateTaskFieldsAction>[1]) {
    setTask((prev) => ({
      ...prev,
      ...(edits.priority !== undefined && { priority: edits.priority }),
      ...(edits.assigneeId !== undefined && {
        assigneeId: edits.assigneeId ?? undefined,
      }),
      ...(edits.dueDate !== undefined && { dueDate: edits.dueDate ?? undefined }),
      ...(edits.estimatedHours !== undefined && {
        estimatedHours: edits.estimatedHours ?? undefined,
      }),
      ...(edits.description !== undefined && {
        description: edits.description ?? undefined,
      }),
    }));
    startTransition(() => {
      void updateTaskFieldsAction(task.id, edits);
    });
  }

  function toggleBlocker(hasActiveBlocker: boolean) {
    setTask((prev) => ({
      ...prev,
      hasActiveBlocker,
      blockerStartedAt: hasActiveBlocker ? new Date().toISOString() : undefined,
    }));
    startTransition(() => {
      void changeTaskBlockerAction(task.id, hasActiveBlocker);
    });
  }

  return (
    <div className="space-y-6">
      <div>
        {pageHeading ? (
          <h1 className="text-base font-semibold text-foreground">{task.title}</h1>
        ) : (
          <h2 className="text-base font-semibold text-foreground">{task.title}</h2>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {detail.project ? (
            <Link
              href={`/projects/${detail.project.id}`}
              className="rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
            >
              {detail.project.name}
            </Link>
          ) : (
            "Unknown project"
          )}
          {detail.client && (
            <>
              {" · "}
              <Link
                href={`/clients/${detail.client.id}`}
                className="rounded-sm outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                {detail.client.name}
              </Link>
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Status</label>
          <StatusSelect
            taskId={task.id}
            status={task.status}
            onChanged={(status) =>
              setTask((prev) => ({
                ...prev,
                status,
                completedAt: status === "done" ? new Date().toISOString() : undefined,
              }))
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Priority</label>
          <select
            aria-label="Priority"
            value={task.priority}
            onChange={(e) => saveFields({ priority: e.target.value as TaskPriority })}
            className={selectClassName}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Assignee</label>
          <select
            aria-label="Assignee"
            value={task.assigneeId ?? ""}
            onChange={(e) => saveFields({ assigneeId: e.target.value || null })}
            className={selectClassName}
          >
            <option value="">Unassigned</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Due date</label>
          <input
            type="date"
            aria-label="Due date"
            value={task.dueDate ? task.dueDate.slice(0, 10) : ""}
            onChange={(e) =>
              saveFields({
                dueDate: e.target.value ? new Date(e.target.value).toISOString() : null,
              })
            }
            className={`${selectClassName} w-full`}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Estimated hours
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            aria-label="Estimated hours"
            placeholder="Fallback"
            value={task.estimatedHours ?? ""}
            onChange={(e) =>
              saveFields({
                estimatedHours: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className={`${selectClassName} w-full`}
          />
        </div>

        <div className="flex items-end">
          <label className="flex h-9 items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={task.hasActiveBlocker}
              onChange={(e) => toggleBlocker(e.target.checked)}
              className="size-4 rounded-sm border-border"
            />
            Active blocker
          </label>
        </div>
      </div>

      {task.hasActiveBlocker && task.blockerStartedAt && (
        <p className="text-xs text-muted-foreground">
          Blocked since {formatShortDate(task.blockerStartedAt)}. This is separate from the
          workflow status above (D-023) — risk computation reads this flag, not the status.
        </p>
      )}

      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Description
        </label>
        <textarea
          aria-label="Description"
          rows={3}
          defaultValue={task.description ?? ""}
          onBlur={(e) => saveFields({ description: e.target.value || null })}
          className="w-full rounded-sm border border-border bg-background p-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
        />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <dt>Created</dt>
        <dd>{formatShortDate(task.createdAt)}</dd>
        {task.completedAt && (
          <>
            <dt>Completed</dt>
            <dd>{formatShortDate(task.completedAt)}</dd>
          </>
        )}
        {assignee && (
          <>
            <dt>Assignee role</dt>
            <dd>{assignee.jobTitle}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
