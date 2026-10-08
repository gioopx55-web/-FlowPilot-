import { CheckCircle2, Clock, Gauge, ListOrdered, Users } from "lucide-react";
import type { MarketingBriefItem } from "@/components/marketing/landingCuration";
import { ShowcaseLayout } from "@/components/marketing/ShowcaseLayout";
import { PreviewCard, PreviewCardHeader } from "@/components/marketing/PreviewCard";

const DOT_COLOR = {
  success: "var(--fp-success)",
  neutral: "var(--fp-text-tertiary)",
  warning: "var(--fp-warning)",
} as const;

/**
 * "What's happening?" (Phase 13.5 §3.3; reframed for the Landing Page
 * warning-balance pass, see DECISIONS.md) — previously rendered the
 * real Dashboard `DailyBrief` component unmodified. `DailyBrief` is,
 * by design, an always-worst-first list of things that need
 * attention — exactly right for the real Dashboard, exactly wrong
 * for a public marketing page, where it made every item in the
 * section read as a problem. This now renders a curated, mixed-entity
 * snapshot (`landingCuration.ts`'s `buildMarketingDailyBrief`) built
 * from the same real selectors — a healthy project, an up-to-date
 * client, a completed task, a healthy teammate, and at most one real
 * attention item — rather than reusing the Dashboard's own component.
 * The real, uncurated, worst-first Daily Brief is still exactly what
 * `/dashboard` shows after signing in.
 */
export function AttentionShowcase({ items }: { items: MarketingBriefItem[] }) {
  return (
    <ShowcaseLayout
      eyebrow="Daily Brief"
      eyebrowIcon={ListOrdered}
      title="A daily snapshot of what's actually happening."
      description="FlowPilot tracks real progress alongside real problems — a project moving forward, a client that's been contacted, work that got done — and still ranks the one or two things that need a look. No dashboard full of charts to interpret."
      bullets={[
        { icon: CheckCircle2, text: "Healthy projects and completed work show up too, not just problems" },
        { icon: Clock, text: "The single most overdue task, not a wall of them" },
        { icon: Users, text: "Client contact history, so follow-up is never a guess" },
        { icon: Gauge, text: "Team workload against real weekly capacity" },
      ]}
      visual={
        <PreviewCard>
          <PreviewCardHeader title="Daily Brief" meta="Today" icon={ListOrdered} />
          <ul className="divide-y divide-border p-0">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-2.5 p-3">
                <span
                  className="mt-1 size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: DOT_COLOR[item.tone] }}
                  aria-hidden="true"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </PreviewCard>
      }
    />
  );
}
