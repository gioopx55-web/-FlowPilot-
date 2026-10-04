import { FolderKanban } from "lucide-react";
import { ComingSoon } from "@/components/primitives/ComingSoon";

export default function ProjectsPage() {
  return (
    <ComingSoon
      icon={FolderKanban}
      title="Projects"
      description="The project list, detail view, and risk flag ship in a later phase."
    />
  );
}
