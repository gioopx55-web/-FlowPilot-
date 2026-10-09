import type { Metadata } from "next";
import {
  getImmutableDailyBriefItems,
  getImmutableAtRiskProjectsSorted,
  getImmutableOverdueTasksSorted,
  getImmutableTeamWorkloadSnapshot,
  getImmutableProjectsWithRisk,
  getImmutableClientsWithFollowUp,
  getImmutableRecentActivities,
  getImmutableOnTimeDeliveryRate,
  getImmutableWorkloadDistribution,
  getImmutableClientsFollowUpAnswer,
  getImmutableTasks,
} from "@/domain/landingSnapshot";
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
 * siblings, unchanged.
 *
 * Every product visual on this page is built from REAL demo content
 * (the same `data/mock/*.ts` fixtures and the same risk/workload/
 * follow-up/Daily-Brief formulas the authenticated app uses) via
 * `domain/landingSnapshot.ts` — but that module reads only the
 * IMMUTABLE base dataset (`getBaseDataset()`), never
 * `getDemoDataset()`/`getDemoStore()` (the shared, request-mutable
 * registry Server Actions write to). This is a deliberate decoupling,
 * not an oversight: a demo visitor creating/editing a project,
 * marking a notification read, changing a preference, or resetting
 * demo data must never change what this public page shows, and this
 * page must be safely static-prerenderable (no per-request mutable
 * read means no hydration-mismatch risk from a cached render window).
 * The authenticated Dashboard/Projects/Clients/Team/Analytics pages
 * are untouched and keep reading `getDemoDataset()` exactly as
 * before — only this page's data source changed.
 */
export default function LandingPage() {
  const briefItems = getImmutableDailyBriefItems(10);
  const atRiskEntries = getImmutableAtRiskProjectsSorted();
  const overdueEntries = getImmutableOverdueTasksSorted();
  const workloadEntries = getImmutableTeamWorkloadSnapshot();
  const allProjects = getImmutableProjectsWithRisk();
  const allClients = getImmutableClientsWithFollowUp();
  const recentActivities = getImmutableRecentActivities(20);
  const onTimeDelivery = getImmutableOnTimeDeliveryRate();
  const workloadDistribution = getImmutableWorkloadDistribution();

  // Marketing-only CURATION (src/components/marketing/landingCuration.ts)
  // — selects a representative, mostly-healthy subset of the real
  // (immutable) data above for this public page only.
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

  const tasks = getImmutableTasks();
  const kanbanColumns = (["todo", "in_progress", "review"] as const).map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status).slice(0, 3),
  }));

  const aiAnswer = getImmutableClientsFollowUpAnswer();

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
