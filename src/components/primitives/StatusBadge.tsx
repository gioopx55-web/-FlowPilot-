import type { TaskPriority, TaskStatus } from "@/types/entities";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";

const STATUS_LABEL: Record<TaskStatus, string> = {
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
  high: "danger",
};

/** Task workflow status, per the Phase 4 §15.4 status-color mapping. */
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

/** Task priority badge. */
export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge tone={PRIORITY_TONE[priority]}>{PRIORITY_LABEL[priority]}</Badge>;
}
