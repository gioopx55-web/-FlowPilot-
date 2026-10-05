import type { Metadata } from "next";
import { getDailyBriefItems } from "@/domain/dailyBrief";
import {
  getAtRiskProjectsSorted,
  getOverdueTasksSorted,
  getClientsNeedingFollowUpSorted,
  getTeamWorkloadSnapshot,
} from "@/domain/selectors";
import { getOnTimeDeliveryRate, getWorkloadDistribution } from "@/domain/analytics";
import { executeAIIntent } from "@/domain/ai/executeIntent";
import { getDemoDataset } from "@/data/mock";
import { MarketingNav } from "@/components/marketing/MarketingNav";
import { Hero } from "@/components/marketing/Hero";
import { DashboardShowcase } from "@/components/marketing/DashboardShowcase";
import { AttentionShowcase } from "@/components/marketing/AttentionShowcase";
import { RiskShowcase } from "@/components/marketing/RiskShowcase";
import { KanbanShowcase } from "@/components/marketing/KanbanShowcase";
import { ClientShowcase } from "@/components/marketing/ClientShowcase";
import { TeamShowcase } from "@/components/marketing/TeamShowcase";
import { AIShowcase } from "@/components/marketing/AIShowcase";
import { AnalyticsShowcase } from "@/components/marketing/AnalyticsShowcase";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const metadata: Metadata = {
  title: "FlowPilot AI — See what needs attention before it becomes a problem",
};

/**
 * Public Landing Page (Phase 13.5) — `/` is now the marketing
 * experience; the real application lives under `/dashboard` and
 * siblings, unchanged. Every product visual on this page is built
 * from the SAME selectors and primitive components the authenticated
 * app uses, reading the current demo workspace's real data — not a
 * separate marketing fixture set (Phase 13.5 §16).
 */
export default function LandingPage() {
  const briefItems = getDailyBriefItems();
  const atRiskEntries = getAtRiskProjectsSorted();
  const overdueEntries = getOverdueTasksSorted();
  const followUpEntries = getClientsNeedingFollowUpSorted();
  const workloadEntries = getTeamWorkloadSnapshot();

  const topRisk =
    atRiskEntries.find((e) => e.risk.level === "critical_risk") ?? atRiskEntries[0];
  const topWorkload =
    workloadEntries.find((e) => e.workload.band === "Overloaded") ?? workloadEntries[0];

  const { tasks } = getDemoDataset();
  const kanbanColumns = (["todo", "in_progress", "review"] as const).map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status).slice(0, 3),
  }));

  const aiAnswer = executeAIIntent("clients_follow_up");
  const onTimeDelivery = getOnTimeDeliveryRate();
  const workloadDistribution = getWorkloadDistribution();

  return (
    <div className="min-h-dvh bg-[var(--fp-bg-canvas)]">
      <MarketingNav />
      <main id="main-content">
        <Hero briefItems={briefItems} topRisk={topRisk} topWorkload={topWorkload} />
        <DashboardShowcase atRiskEntries={atRiskEntries} overdueEntries={overdueEntries} />
        <div id="features">
          <AttentionShowcase />
          <RiskShowcase entry={topRisk} />
          <KanbanShowcase columns={kanbanColumns} />
          <ClientShowcase entries={followUpEntries} />
          <TeamShowcase entries={workloadEntries} />
          <AIShowcase answer={aiAnswer} />
          <AnalyticsShowcase
            onTimeDelivery={onTimeDelivery}
            workloadDistribution={workloadDistribution}
          />
        </div>
        <FinalCTA />
      </main>
      <MarketingFooter />
    </div>
  );
}
