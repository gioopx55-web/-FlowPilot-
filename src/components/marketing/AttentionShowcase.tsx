import { AlertTriangle, Clock, Gauge, ListOrdered, Users } from "lucide-react";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";
import { DailyBrief } from "@/components/dashboard/DailyBrief";

/**
 * "What needs attention?" (Phase 13.5 §3.3) — renders the real
 * Dashboard `DailyBrief` component unmodified, not a marketing
 * recreation of it, so this section can never drift from what the
 * actual product shows (Phase 13.5 §16).
 */
export function AttentionShowcase() {
  return (
    <ShowcaseLayout
      eyebrow="Daily Brief"
      eyebrowIcon={ListOrdered}
      title="What needs attention — ranked, not buried."
      description="Every morning, FlowPilot ranks the handful of things that actually matter: a critical-risk project, the most overdue task, the client that's gone quiet, the teammate who's overloaded. No dashboard full of charts to interpret — a short, prioritized list."
      bullets={[
        { icon: AlertTriangle, text: "Critical Risk and At Risk projects surface first" },
        { icon: Clock, text: "The single most overdue task, not a wall of them" },
        { icon: Users, text: "The client most overdue for a follow-up" },
        { icon: Gauge, text: "Whoever is most overloaded right now" },
      ]}
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Daily Brief" meta="Today" icon={ListOrdered} />
          <div className="p-3">
            <DailyBrief />
          </div>
        </PreviewCard>
      }
    />
  );
}
