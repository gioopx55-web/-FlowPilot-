import { AlertCircle } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/types/entities";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";

/**
 * Kanban column / TaskStatus reconciliation (Phase 9 §5, DECISIONS.md
 * D-038): the approved TaskStatus enum has no "backlog" value, so
 * Kanban's 5 columns map 1:1 onto these 5 labels — "To Do" stands in
 * for the old IA sketch's "Backlog" and "Blocked" is a real, visible
 * column. This is the one canonical label map; Kanban/StatusSelect
 * import it rather than re-declaring it.
 */
export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  review: "Review",
  done: "Done",
};

const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  todo: "neutral",
  in_progress: "accent",
  blocked: "warning",
  review: "info",
  done: "success",
};

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const PRIORITY_TONE: Record<TaskPriority, BadgeTone> = {
  low: "neutral",
  medium: "accent",
  high: "warning",
};

/** Task workflow status, per the Phase 4 §15.4 status-color mapping. */
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{TASK_STATUS_LABEL[status]}</Badge>;
}

/** Task priority badge. */
export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{PRIORITY_LABEL[priority]}</Badge>;
}

/**
 * The active-blocker indicator (D-023) — deliberately separate from
 * TaskStatusBadge. A task can show this regardless of its workflow
 * status; it never implies or is implied by `status === "blocked"`.
 */
export function TaskBlockerIndicator() {
  return (
    <Badge tone="warning" icon={<AlertCircle className="size-3" aria-hidden="true" />}>
      Blocked
    </Badge>
  );
}
