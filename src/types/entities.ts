/**
 * FlowPilot AI entity types — Phase 3 Data Model (PROJECT_PLAN.md §13,
 * DECISIONS.md D-019–D-023). This file is the single TypeScript source
 * for these shapes; mock fixtures (Phase 6) and feature code (Phase 6+)
 * must import from here rather than re-declaring these interfaces.
 *
 * No entity has been given runtime behavior yet — this is the data
 * contract only, per the approved Phase 5 scope (no business features).
 */

export type ID = string;

export interface Workspace {
  id: ID;
  name: string;
  createdAt: string;
}

export type WorkspaceRole = "owner" | "manager" | "member";

export interface User {
  id: ID;
  workspaceId: ID;
  email: string;
  displayName: string;
  avatarUrl?: string;
  /** Authentication/workspace identity only — never a permissions matrix (D-021). */
  workspaceRole: WorkspaceRole;
  teamMemberId?: ID;
  createdAt: string;
}

export interface TeamMember {
  id: ID;
  workspaceId: ID;
  name: string;
  /** Renamed from `role` (D-020). Free text, flexible, never used for permissions. */
  jobTitle: string;
  avatarUrl?: string;
  weeklyCapacityHours: number;
  active: boolean;
}

export type ClientStatus = "active" | "retainer" | "dormant";

export interface Client {
  id: ID;
  workspaceId: ID;
  name: string;
  status: ClientStatus;
  primaryContactName: string;
  primaryContactEmail?: string;
  /** Derived cache — recomputed on every ClientInteraction write, never hand-edited. */
  lastInteractionAt?: string;
  createdAt: string;
}

export type InteractionType = "call" | "email" | "meeting" | "update_sent" | "note";

export interface ClientInteraction {
  id: ID;
  workspaceId: ID;
  clientId: ID;
  type: InteractionType;
  summary: string;
  occurredAt: string;
  createdByUserId: ID;
}

export type ProjectStatus = "kickoff" | "in_progress" | "review" | "completed" | "on_hold";

export interface Project {
  id: ID;
  workspaceId: ID;
  clientId: ID;
  name: string;
  status: ProjectStatus;
  progressPct: number;
  dueDate?: string;
  startDate: string;
  createdAt: string;
}

export type RiskCondition =
  | "overdue_task_ratio_exceeded"
  | "high_priority_overdue"
  | "due_soon_low_progress"
  | "unresolved_blocker_stale";

export type RiskLevel = "none" | "at_risk" | "critical_risk";

export interface ProjectRiskSnapshot {
  id: ID;
  projectId: ID;
  /** Derived from conditions.length — never independently settable (§13.17). */
  level: RiskLevel;
  conditions: RiskCondition[];
  computedAt: string;
  // V1 reads/keeps only the latest snapshot per project (D-022).
  // No history UI/analytics depends on this being a time series in V1.
}

export type TaskStatus = "todo" | "in_progress" | "blocked" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: ID;
  workspaceId: ID;
  projectId: ID;
  title: string;
  description?: string;
  /** Workflow state — rendered by Kanban/task list. Decoupled from blocker tracking (D-023). */
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: ID;
  dueDate?: string;
  /** Optional. Fallback hours (D-019) apply only at computation time — never written here. */
  estimatedHours?: number;
  /** Unresolved blocking condition consumed only by Project Risk computation (D-023). */
  hasActiveBlocker: boolean;
  blockerStartedAt?: string;
  createdAt: string;
  completedAt?: string;
}

export type ActivityType =
  | "status_changed"
  | "reassigned"
  | "due_date_changed"
  | "created"
  | "completed"
  | "blocker_opened"
  | "blocker_resolved";

export interface Activity {
  id: ID;
  workspaceId: ID;
  projectId: ID;
  taskId?: ID;
  type: ActivityType;
  actorUserId?: ID;
  /** Generated and frozen at write time — never re-rendered from field diffs later. */
  summary: string;
  occurredAt: string;
}

export type NotificationCategory = "overdue" | "assigned" | "mentioned" | "follow_up_due";

export interface Notification {
  id: ID;
  workspaceId: ID;
  recipientUserId: ID;
  category: NotificationCategory;
  referenceType: "task" | "project" | "client";
  referenceId: ID;
  message: string;
  read: boolean;
  createdAt: string;
}

export type InsightType =
  | "daily_brief"
  | "overdue_tasks"
  | "follow_up_needed"
  | "workload_analysis"
  | "project_summary"
  | "weekly_report"
  | "client_update_draft";

export interface AIInsight {
  id: ID;
  workspaceId: ID;
  type: InsightType;
  scope?: { kind: "project" | "client" | "team_member"; id: ID };
  summary: string;
  references: { type: "task" | "project" | "client" | "team_member"; id: ID }[];
  generatedAt: string;
  /** Mandatory when reporting risk — never free-text-only (D-016). */
  riskConditions?: RiskCondition[];
}

export interface AIConversation {
  id: ID;
  workspaceId: ID;
  userId: ID;
  startedAt: string;
}

export interface AIMessage {
  id: ID;
  conversationId: ID;
  role: "user" | "assistant";
  content: string;
  insightId?: ID;
  createdAt: string;
}
