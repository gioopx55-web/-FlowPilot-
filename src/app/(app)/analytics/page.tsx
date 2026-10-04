import { BarChart3 } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function AnalyticsPage() {
  return (
    <ComingSoon
      icon={BarChart3}
      title="Analytics"
      description="On-time delivery rate, workload distribution, and overdue trend ship in a later phase."
    />
  );
}
