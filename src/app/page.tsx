import type { Metadata } from "next";
import { getDailyBriefItems } from "@/domain/dailyBrief";
import {
  getAtRiskProjectsSorted,
  getOverdueTasksSorted,
  getTeamWorkloadSnapshot,
  getProjectsWithRisk,
  getClientsFiltered,
  getRecentActivities,
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
import {
  buildHeroSnapshot,
  pickProjectHealthExamples,
  pickMarketingRiskExample,
  pickMarketingClients,
  pickMarketingTeam,
  buildMarketingDailyBrief,
} from "@/components/marketing/landingCuration";

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
  // Real, unmodified domain reads — identical to what the authenticated
  // app itself calls. Nothing about risk/workload/follow-up computation
  // changes here or anywhere below.
  const briefItems = getDailyBriefItems(10);
  const atRiskEntries = getAtRiskProjectsSorted();
  const overdueEntries = getOverdueTasksSorted();
  const workloadEntries = getTeamWorkloadSnapshot();
  const allProjects = getProjectsWithRisk();
  const allClients = getClientsFiltered({}, "name");
  const recentActivities = getRecentActivities(20);
  const onTimeDelivery = getOnTimeDeliveryRate();
  const workloadDistribution = getWorkloadDistribution();

  // Marketing-only CURATION (src/components/marketing/landingCuration.ts)
  // — selects a representative, mostly-healthy subset of the real data
  // above for this public page only. The authenticated Dashboard/
  // Projects/Clients/Team/Analytics pages are untouched and keep using
  // the real worst-first selector output directly, exactly as before.
  const heroSnapshot = buildHeroSnapshot({
    allProjects,
    briefItems,
    workloadEntries,
    onTimeDeliveryPct: onTimeDelivery?.onTimePct,
  });
  const projectHealthEntries = pickProjectHealthExamples(allProjects, 4);
  const marketingRiskExample = pickMarketingRiskExample(atRiskEntries);
  const marketingClients = pickMarketingClients(allClients, 4);
  const marketingTeam = pickMarketingTeam(workloadEntries, 4);
  const marketingDailyBrief = buildMarketingDailyBrief({
    healthyProject: heroSnapshot.healthyProjects[0],
    upToDateClient: allClients.find((e) => !e.followUp.needsFollowUp),
    completedActivity: recentActivities.find((a) => a.type === "completed"),
    healthyMember: workloadEntries.find(
      (e) => e.workload.band === "Healthy" || e.workload.band === "Available",
    ),
    attentionItem: heroSnapshot.attentionItem,
  });

  const { tasks } = getDemoDataset();
  const kanbanColumns = (["todo", "in_progress", "review"] as const).map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status).slice(0, 3),
  }));

  const aiAnswer = executeAIIntent("clients_follow_up");

  return (
    <div className="min-h-dvh bg-[var(--fp-bg-canvas)]">
      <MarketingNav />
      <main id="main-content">
        <Hero snapshot={heroSnapshot} />
        <DashboardShowcase projectHealthEntries={projectHealthEntries} overdueEntries={overdueEntries} />
        <div id="features">
          <AttentionShowcase items={marketingDailyBrief} />
          <RiskShowcase entry={marketingRiskExample} />
          <KanbanShowcase columns={kanbanColumns} />
          <ClientShowcase entries={marketingClients} />
          <TeamShowcase entries={marketingTeam} />
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
