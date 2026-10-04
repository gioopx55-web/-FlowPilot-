import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { DailyBrief } from "@/components/dashboard/DailyBrief";
import { AtRiskProjects } from "@/components/dashboard/AtRiskProjects";
import { OverdueTasks } from "@/components/dashboard/OverdueTasks";
import { ClientsFollowUp } from "@/components/dashboard/ClientsFollowUp";
import { TeamWorkloadSnapshot } from "@/components/dashboard/TeamWorkloadSnapshot";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

/**
 * Dashboard (Phase 7). Sections render in the approved order (Daily
 * Brief / At-Risk Projects / Overdue Tasks / Clients Needing
 * Follow-Up / Team Workload Snapshot / Recent Activity) — the DOM
 * order below *is* the priority order, so mobile's single-column
 * stack shows the most urgent information first with no extra work.
 * Every number on this page comes from src/domain selectors; no
 * risk/workload/overdue/follow-up logic is computed here.
 */
export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <DashboardSection title="Daily Brief">
            <DailyBrief />
          </DashboardSection>
        </div>

        <DashboardSection
          title="At-Risk Projects"
          action={{ label: "View all projects", href: "/projects" }}
        >
          <AtRiskProjects />
        </DashboardSection>

        <DashboardSection
          title="Overdue Tasks"
          action={{ label: "View all overdue", href: "/tasks?status=overdue" }}
        >
          <OverdueTasks />
        </DashboardSection>

        <DashboardSection
          title="Clients Needing Follow-Up"
          action={{ label: "View all clients", href: "/clients" }}
        >
          <ClientsFollowUp />
        </DashboardSection>

        <DashboardSection
          title="Team Workload Snapshot"
          action={{ label: "View team", href: "/team" }}
        >
          <TeamWorkloadSnapshot />
        </DashboardSection>

        <div className="md:col-span-2">
          <DashboardSection title="Recent Activity">
            <RecentActivity />
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
