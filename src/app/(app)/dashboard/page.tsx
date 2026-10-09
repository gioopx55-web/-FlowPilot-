import { PageHeader } from "@/components/primitives/PageHeader";
import { Section } from "@/components/primitives/Section";
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
      <PageHeader
        title="Dashboard"
        description="What needs your attention today, ranked — not buried in a list."
      />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="md:col-span-2">
          <Section title="Daily Brief">
            <DailyBrief />
          </Section>
        </div>

        {/* self-start: this cell's content is shorter than its row sibling
            (Overdue Tasks); without it, CSS Grid's default stretch leaves a
            large empty gap below the bordered list box. */}
        <div className="self-start">
          <Section
            title="At-Risk Projects"
            action={{ label: "View all projects", href: "/projects" }}
          >
            <AtRiskProjects />
          </Section>
        </div>

        <Section
          title="Overdue Tasks"
          action={{ label: "View all overdue", href: "/tasks?status=overdue" }}
        >
          <OverdueTasks />
        </Section>

        <Section
          title="Clients Needing Follow-Up"
          action={{ label: "View all clients", href: "/clients" }}
        >
          <ClientsFollowUp />
        </Section>

        <Section
          title="Team Workload Snapshot"
          action={{ label: "View team", href: "/team" }}
        >
          <TeamWorkloadSnapshot />
        </Section>

        <div className="md:col-span-2">
          <Section title="Recent Activity">
            <RecentActivity />
          </Section>
        </div>
      </div>
    </div>
  );
}
