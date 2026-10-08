"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import type { HeroSnapshot } from "@/components/marketing/landingCuration";
import { Badge } from "@/components/primitives/Badge";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getLocale } from "@/lib/locale";

const DOT_COLOR = {
  success: "var(--fp-success)",
  neutral: "var(--fp-text-tertiary)",
  warning: "var(--fp-warning)",
} as const;

/**
 * Hero product preview (Phase 13.5 §2; redesigned for the Landing
 * Page warning-balance pass, see DECISIONS.md) — a curated "workspace
 * snapshot" built from `landingCuration.ts`'s `HeroSnapshot`: up to 2
 * real on-track projects, at most one real attention item, and two
 * real summary metrics. Unlike the Phase 13.5/17.6 version, this
 * deliberately does NOT default to the worst available signal
 * (Critical Risk / Overloaded) — the public marketing page's job is
 * to demonstrate "operations are healthy, problems surface early,"
 * not to lead with the worst real record in the demo dataset. The
 * real, uncurated, worst-first Daily Brief is one click away at
 * `/dashboard`.
 *
 * The two glance tiles use plain `Badge` chips rather than the full
 * `RiskBadge`/`WorkloadBadge` primitives deliberately: those
 * primitives' disclosure trigger needs more width than this ~190px
 * tile has (Phase 13.5 §2 finding, still true). The lightweight 3D
 * depth (Phase 13.5 §6) is a CSS-perspective tilt at rest that
 * settles flat as the hero scrolls past — no 3D library.
 */
export function HeroProductPreview({ snapshot }: { snapshot: HeroSnapshot }) {
  const reducedMotion = useReducedMotion();
  const { dir } = getLocale();
  const tiltSign = dir === "rtl" ? -1 : 1;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-8 * tiltSign, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -16]);

  const style = reducedMotion
    ? undefined
    : { rotateX, rotateY, y: translateY, transformPerspective: 1400 };

  const rows: { id: string; tone: keyof typeof DOT_COLOR; title: string; description: string }[] =
    [];

  snapshot.healthyProjects.forEach((entry, index) => {
    rows.push({
      id: `hero_project_${entry.project.id}`,
      tone: "success",
      title: `${entry.project.name} is on track`,
      description:
        index === 0
          ? `${entry.client?.name ?? "Client"} · ${entry.project.progressPct}% complete`
          : `Progressing normally · ${entry.project.progressPct}% complete`,
    });
  });

  if (snapshot.attentionItem) {
    rows.push({
      id: `hero_attention_${snapshot.attentionItem.id}`,
      tone: "warning",
      title: snapshot.attentionItem.title,
      description: snapshot.attentionItem.description,
    });
  }

  rows.push({
    id: "hero_team_metric",
    tone: "neutral",
    title: `${snapshot.teamHealthyCount} of ${snapshot.teamTotalCount} team members at healthy capacity`,
    description: "Workload tracked against real weekly capacity, not guesswork",
  });

  return (
    // No static `perspective` CSS here: it would establish a 3D
    // rendering context for every descendant even when reduced motion
    // removes the actual transform, which caused a real Chromium
    // compositing glitch found via visual verification. `transformPerspective`
    // on the motion.div's own style below is enough when motion is active.
    <div ref={containerRef} className="relative min-w-0 px-3 pt-3">
      {/* Layered backdrop fragment (Phase 13.6 §5/§6) — a second,
          smaller surface peeking out behind the main card, purely
          decorative. */}
      <div
        aria-hidden="true"
        className="absolute inset-3 top-6 -z-10 rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface)] opacity-60"
        style={reducedMotion ? undefined : { transform: `rotate(${2 * tiltSign}deg)` }}
      />

      <motion.div
        style={style}
        initial={reducedMotion ? undefined : { opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
        className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[var(--fp-radius-lg)] border border-border bg-[var(--fp-bg-surface-raised)] shadow-[var(--fp-shadow-level-2)]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-xs font-medium text-muted-foreground">Workspace snapshot</span>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>

        <ul className="divide-y divide-border">
          {rows.map((row) => (
            <li key={row.id} className="flex items-start gap-2.5 p-3">
              <span
                className="mt-1 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: DOT_COLOR[row.tone] }}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-foreground">
                  {row.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {row.description}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {(snapshot.healthyProjects[0] || snapshot.onTimeDeliveryPct !== undefined) && (
          <div className="grid grid-cols-2 gap-3 border-t border-border p-3">
            {snapshot.healthyProjects[0] && (
              <div className="rounded-[var(--fp-radius-md)] border border-border p-2.5">
                <p className="mb-1.5 truncate text-xs text-muted-foreground">
                  {snapshot.healthyProjects[0].project.name}
                </p>
                <Badge tone="success">On Track</Badge>
              </div>
            )}
            {snapshot.onTimeDeliveryPct !== undefined && (
              <div className="rounded-[var(--fp-radius-md)] border border-border p-2.5">
                <p className="mb-1.5 truncate text-xs text-muted-foreground">On-time delivery</p>
                <Badge tone="neutral">{snapshot.onTimeDeliveryPct}%</Badge>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Floating operational signal (Phase 13.6 §6) — a small chip
          overlapping the card's top edge. Now a POSITIVE count (real
          on-track projects), not an alarm: the warning-balance pass
          judged a floating, amber, alert-triangle "N need attention"
          chip too loud a first impression for a public marketing page
          to lead with, however real the count behind it was. Rendered
          as a sibling of the card, not a child, since the card itself
          is `overflow-hidden` and would clip anything meant to float
          past its own edge. */}
      {snapshot.onTrackProjectCount > 0 && (
        <div
          aria-hidden="true"
          className="absolute top-0 end-6 z-10 flex items-center gap-1 rounded-full border border-border bg-[var(--fp-bg-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--fp-success)] shadow-[var(--fp-shadow-level-1)]"
        >
          <CheckCircle2 className="size-3" aria-hidden="true" />
          {snapshot.onTrackProjectCount} projects on track
        </div>
      )}
    </div>
  );
}
