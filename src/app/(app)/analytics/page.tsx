import {
  getOnTimeDeliveryRate,
  getWorkloadDistribution,
  getOverdueTaskTrend,
  getProjectStatusDistribution,
  getProjectRiskDistribution,
  getActiveProjectAverageProgress,
} from "@/domain/analytics";
import { getOverdueTasks, getAtRiskProjectsSorted } from "@/domain/selectors";
import { Section } from "@/components/primitives/Section";
import { PageHeader } from "@/components/primitives/PageHeader";
import { OperationalSummary } from "@/components/analytics/OperationalSummary";
import { OnTimeDeliveryCard } from "@/components/analytics/OnTimeDeliveryCard";
import { OverdueTrendChart } from "@/components/analytics/OverdueTrendChart";
import { WorkloadDistributionChart } from "@/components/analytics/WorkloadDistributionChart";
import { ProjectStatusChart } from "@/components/analytics/ProjectStatusChart";
import { ProjectRiskChart } from "@/components/analytics/ProjectRiskChart";
import { AnalyticsInsights } from "@/components/analytics/AnalyticsInsights";
import { formatShortDate } from "@/lib/format";
import { DEMO_TODAY_ISO } from "@/lib/demo-clock";

const OVERDUE_TREND_WEEKS = 8;

export default function AnalyticsPage() {
  const onTimeDelivery = getOnTimeDeliveryRate();
  const workloadDistribution = getWorkloadDistribution();
  const overdueTrend = getOverdueTaskTrend(OVERDUE_TREND_WEEKS);
  const projectStatusDistribution = getProjectStatusDistribution();
  const projectRiskDistribution = getProjectRiskDistribution();
  const activeAverageProgress = getActiveProjectAverageProgress();
  const overdueCount = getOverdueTasks().length;
  const atRiskCount = getAtRiskProjectsSorted().length;

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <PageHeader
        title="Analytics"
        description={`Current workspace state as of ${formatShortDate(DEMO_TODAY_ISO)}. Overdue trend covers the last ${OVERDUE_TREND_WEEKS} weeks.`}
      />

      <OperationalSummary
        stats={[
          {
            label: "On-time delivery",
            value: onTimeDelivery ? `${onTimeDelivery.onTimePct}%` : "No data",
          },
          { label: "Overdue tasks", value: String(overdueCount) },
          { label: "At-risk projects", value: String(atRiskCount) },
          {
            label: "Avg. active progress",
            value: activeAverageProgress !== undefined ? `${activeAverageProgress}%` : "No data",
          },
        ]}
      />

      <Section title="On-Time Delivery">
        <OnTimeDeliveryCard result={onTimeDelivery} />
      </Section>

      <Section title="Overdue Task Trend">
        <OverdueTrendChart points={overdueTrend} />
      </Section>

      <Section title="Workload Distribution" action={{ label: "View team", href: "/team" }}>
        <WorkloadDistributionChart distribution={workloadDistribution} />
      </Section>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section title="Project Status" action={{ label: "View projects", href: "/projects" }}>
          <ProjectStatusChart distribution={projectStatusDistribution} />
        </Section>
        <Section title="Project Risk">
          <ProjectRiskChart distribution={projectRiskDistribution} />
        </Section>
      </div>

      <Section title="Insights">
        <AnalyticsInsights
          onTimeDelivery={onTimeDelivery}
          workload={workloadDistribution}
          risk={projectRiskDistribution}
          overdueTrend={overdueTrend}
        />
      </Section>
    </div>
  );
}
