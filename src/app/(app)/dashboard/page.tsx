import { LayoutDashboard } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function DashboardPage() {
  return (
    <ComingSoon
      icon={LayoutDashboard}
      title="Dashboard"
      description="The Daily Brief, at-risk projects, overdue tasks, and workload snapshot ship in a later phase."
    />
  );
}
