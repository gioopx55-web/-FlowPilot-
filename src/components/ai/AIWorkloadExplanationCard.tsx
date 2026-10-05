import Link from "next/link";
import type { AIWorkloadExplanation } from "@/domain/ai/workloadExplanation";
import { MemberWorkloadExplanation } from "@/components/team/MemberWorkloadExplanation";

/**
 * Reuses Team Member Detail's own `MemberWorkloadExplanation` (Phase
 * 12) exactly — the AI's workload answer and the Team page must
 * never show a different breakdown of the same member.
 */
export function AIWorkloadExplanationCard({ data }: { data: AIWorkloadExplanation }) {
  return (
    <div>
      <Link
        href={`/team/${data.member.id}`}
        className="text-sm font-semibold text-foreground outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
      >
        {data.member.name}
      </Link>
      <p className="mb-2 text-xs text-muted-foreground">{data.member.jobTitle}</p>
      <MemberWorkloadExplanation workload={data.workload} contributors={data.contributors} />
    </div>
  );
}
