import Link from "next/link";
import type { DailyBriefItem } from "@/domain/dailyBrief";
import type { AtRiskProjectEntry, TeamWorkloadEntry } from "@/domain/selectors";
import { Button } from "@/components/ui/button";
import { StaggerGroup, StaggerItem } from "@/components/marketing/StaggerGroup";
import { HeroProductPreview } from "@/components/marketing/HeroProductPreview";

export function Hero({
  briefItems,
  topRisk,
  topWorkload,
}: {
  briefItems: DailyBriefItem[];
  topRisk: AtRiskProjectEntry | undefined;
  topWorkload: TeamWorkloadEntry | undefined;
}) {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-36 lg:px-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--fp-accent-subtle-bg),transparent)]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <StaggerGroup className="min-w-0 text-center lg:text-start">
          <StaggerItem>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-[var(--fp-bg-surface)] px-3 py-1 text-xs font-medium text-muted-foreground">
              FlowPilot AI
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              See what needs attention before it becomes a problem.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground lg:mx-0 lg:text-lg">
              FlowPilot AI watches every project, task, client, and teammate in one
              workspace, and surfaces risk, overdue work, and overloaded people before
              they derail a delivery — with an AI layer that reasons over that same
              real data, not a generic chatbot.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="/dashboard">Open FlowPilot Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="#product-preview">See how it works</a>
              </Button>
            </div>
          </StaggerItem>
        </StaggerGroup>

        <HeroProductPreview briefItems={briefItems} topRisk={topRisk} topWorkload={topWorkload} />
      </div>
    </section>
  );
}
