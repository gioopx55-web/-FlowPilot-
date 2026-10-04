import type { TaskStatus } from "@/types/entities";
import { TASK_STATUS_LABEL } from "@/components/primitives/StatusBadge";

/**
 * Column order for Kanban and the StatusSelect alternate control —
 * derived from the one canonical label map in StatusBadge.tsx (see
 * the Kanban/TaskStatus reconciliation note there and DECISIONS.md
 * D-038), so there is exactly one place these 5 labels are defined.
 */
const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "blocked", "review", "done"];

export const TASK_STATUS_OPTIONS: { value: TaskStatus; label: string }[] = STATUS_ORDER.map(
  (value) => ({ value, label: TASK_STATUS_LABEL[value] }),
);
