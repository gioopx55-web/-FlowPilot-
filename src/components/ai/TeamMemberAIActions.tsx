"use client";

import { Sparkles } from "lucide-react";
import { useShellPanels } from "@/components/shell/panel-context";
import { Button } from "@/components/ui/button";

/** Team Member Detail's contextual AI entry point (Phase 13 §12): "Explain workload". */
export function TeamMemberAIActions({ memberId, memberName }: { memberId: string; memberName: string }) {
  const { openAIWithRequest } = useShellPanels();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        openAIWithRequest({
          intentId: "team_member_workload_explanation",
          scope: { kind: "team_member", id: memberId },
          label: `Explain ${memberName}'s workload`,
        })
      }
    >
      <Sparkles className="size-3.5" aria-hidden="true" />
      Explain workload
    </Button>
  );
}
