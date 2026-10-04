import type { TeamMember } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * ~8 team members (PROJECT_PLAN.md §7). `jobTitle` is free text, never
 * a permission role (D-020). `weeklyCapacityHours` plus the tasks
 * assigned to each member (tasks.ts) are engineered so the four
 * approved workload bands are each demonstrated at least once — see
 * domain/workload/workload.ts and the comment above each member below
 * for which band their current assignment set is designed to produce.
 */
export const teamMembers: TeamMember[] = [
  {
    id: "tm_maya",
    workspaceId: WORKSPACE_ID,
    name: "Maya Chen",
    jobTitle: "Founder & Creative Director",
    weeklyCapacityHours: 30,
    active: true,
  },
  {
    id: "tm_theo",
    workspaceId: WORKSPACE_ID,
    name: "Theo Park",
    jobTitle: "Project Manager",
    weeklyCapacityHours: 40,
    active: true,
  },
  {
    // Overloaded: assigned open-task hours sum to 44h / 35h capacity ≈ 126%.
    id: "tm_sana",
    workspaceId: WORKSPACE_ID,
    name: "Sana Iyer",
    jobTitle: "Senior Designer",
    weeklyCapacityHours: 35,
    active: true,
  },
  {
    // Healthy: assigned open-task hours sum to 28h / 38h capacity ≈ 74%.
    id: "tm_jordan",
    workspaceId: WORKSPACE_ID,
    name: "Jordan Lee",
    jobTitle: "Frontend Developer",
    weeklyCapacityHours: 38,
    active: true,
  },
  {
    // High: assigned open-task hours sum to 38h / 38h capacity = 100%.
    id: "tm_priya",
    workspaceId: WORKSPACE_ID,
    name: "Priya Nair",
    jobTitle: "Backend Developer",
    weeklyCapacityHours: 38,
    active: true,
  },
  {
    id: "tm_marcus",
    workspaceId: WORKSPACE_ID,
    name: "Marcus Webb",
    jobTitle: "Brand Strategist",
    weeklyCapacityHours: 32,
    active: true,
  },
  {
    id: "tm_elena",
    workspaceId: WORKSPACE_ID,
    name: "Elena Petrova",
    jobTitle: "Account Lead",
    weeklyCapacityHours: 36,
    active: true,
  },
  {
    // Available: assigned open-task hours sum to 18h / 36h capacity = 50%.
    id: "tm_omar",
    workspaceId: WORKSPACE_ID,
    name: "Omar Haddad",
    jobTitle: "Junior Designer",
    weeklyCapacityHours: 36,
    active: true,
  },
];
