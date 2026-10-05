import type { AIAnswer } from "@/domain/ai/executeIntent";
import { AIResultList } from "@/components/ai/AIResultList";
import { AIProjectSummaryCard } from "@/components/ai/AIProjectSummaryCard";
import { AIProjectRiskExplanationCard } from "@/components/ai/AIProjectRiskExplanationCard";
import { AIWorkloadExplanationCard } from "@/components/ai/AIWorkloadExplanationCard";
import { AIWeeklyReportCard } from "@/components/ai/AIWeeklyReportCard";

/** Dispatches a structured AIAnswer to its renderer — the one place that decides which card a `kind` maps to. */
export function AIAnswerView({ answer }: { answer: AIAnswer }) {
  switch (answer.kind) {
    case "list":
      return <AIResultList heading={answer.heading} rows={answer.rows} emptyMessage={answer.emptyMessage} />;
    case "project_summary":
      return <AIProjectSummaryCard data={answer.data} />;
    case "project_risk_explanation":
      return <AIProjectRiskExplanationCard data={answer.data} />;
    case "team_member_workload_explanation":
      return <AIWorkloadExplanationCard data={answer.data} />;
    case "weekly_report":
      return <AIWeeklyReportCard data={answer.data} />;
    case "needs_scope":
    case "unsupported":
      return <p className="text-sm text-muted-foreground">{answer.message}</p>;
  }
}
