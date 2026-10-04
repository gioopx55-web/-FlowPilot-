import { ListChecks } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function TasksPage() {
  return (
    <ComingSoon
      icon={ListChecks}
      title="Tasks"
      description="The global task list, filters, and Task Detail ship in a later phase."
    />
  );
}
