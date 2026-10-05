"use client";

import { Sparkles } from "lucide-react";
import { useShellPanels } from "@/components/shell/panel-context";
import { Button } from "@/components/ui/button";

/**
 * Project Detail's contextual AI entry points (Phase 13 §12):
 * "Summarize project" / "Explain risk". Both open the SAME global AI
 * panel (Phase 5), pre-scoped to this project — no separate AI
 * implementation lives on this page.
 */
export function ProjectAIActions({ projectId }: { projectId: string }) {
  const { openAIWithRequest } = useShellPanels();

  return (
    <div className="flex items-center gap-1.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          openAIWithRequest({
            intentId: "project_summary",
            scope: { kind: "project", id: projectId },
            label: "Summarize this project",
          })
        }
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
        Summarize
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          openAIWithRequest({
            intentId: "project_risk_explanation",
            scope: { kind: "project", id: projectId },
            label: "Why is this project at risk?",
          })
        }
      >
        Explain risk
      </Button>
    </div>
  );
}
