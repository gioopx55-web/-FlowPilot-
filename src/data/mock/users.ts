import type { User } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * Demo login identities only (Constitution §4 exclusion: no real
 * authentication in V1). `workspaceRole` is a lightweight identity
 * distinction, never a permissions matrix (D-021) — it must not gate
 * any feature in this codebase.
 */
export const users: User[] = [
  {
    id: "usr_maya",
    workspaceId: WORKSPACE_ID,
    email: "maya@northboundstudio.example",
    displayName: "Maya Chen",
    workspaceRole: "owner",
    teamMemberId: "tm_maya",
    createdAt: "2024-01-15T09:00:00.000Z",
  },
  {
    id: "usr_theo",
    workspaceId: WORKSPACE_ID,
    email: "theo@northboundstudio.example",
    displayName: "Theo Park",
    workspaceRole: "manager",
    teamMemberId: "tm_theo",
    createdAt: "2024-02-01T09:00:00.000Z",
  },
];
