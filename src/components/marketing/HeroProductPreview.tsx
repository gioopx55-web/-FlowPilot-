"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { AlertTriangle } from "lucide-react";
import type { DailyBriefItem } from "@/domain/dailyBrief";
import type { AtRiskProjectEntry, TeamWorkloadEntry } from "@/domain/selectors";
import { Badge, type BadgeTone } from "@/components/primitives/Badge";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getLocale } from "@/lib/locale";

const AMBIENT_ICON_BY_KIND: Record<DailyBriefItem["kind"], string> = {
  critical_risk: "var(--fp-danger)",
  at_risk: "var(--fp-warning)",
  overdue_task: "var(--fp-warning)",
  follow_up: "var(--fp-info)",
  overloaded_member: "var(--fp-danger)",
  activity: "var(--fp-text-tertiary)",
};

const WORKLOAD_TONE: Record<string, BadgeTone> = {
  Available: "neutral",
  Healthy: "success",
  High: "warning",
  Overloaded: "danger",
};

/**
 * Hero product preview (Phase 13.5 §2) — real `getDailyBriefItems`/
 * `getAtRiskProjectsSorted`/`getTeamWorkloadSnapshot` data (passed in
 * from the Server Component page). The two glance tiles use plain
 * `Badge` chips rather than the full `RiskBadge`/`WorkloadBadge`
 * primitives deliberately: those primitives' critical-risk reason
 * line and 44px disclosure trigger need more width than this ~190px
 * tile has, and overflowed into the sibling tile when tried (found
 * via visual verification) — a non-interactive marketing glance card
 * is also not a place a clickable disclosure belongs. Phase 13.5 §2
 * explicitly allows simplifying the preview; the full interactive
 * badge is one click away at `/dashboard`. The lightweight 3D depth
 * (Phase 13.5 §6) is a CSS-perspective tilt at rest that settles flat
 * as the hero scrolls past — no 3D library.
 *
 * Phase 17.6: widened `max-w-md` → `max-w-lg` — a stronger, more
 * immersive focal point per the visual-direction upgrade, paired with
 * a second, tighter ambient glow layer behind this side of the Hero
 * (`Hero.tsx`) rather than any change to this component's own depth
 * treatment, which was already judged sufficient (backdrop fragment +
 * floating chip + tilt).
 */
export function HeroProductPreview({
  briefItems,
  topRisk,
  topWorkload,
}: {
  briefItems: DailyBriefItem[];
  topRisk: AtRiskProjectEntry | undefined;
  topWorkload: TeamWorkloadEntry | undefined;
}) {
  const reducedMotion = useReducedMotion();
  const { dir } = getLocale();
  const tiltSign = dir === "rtl" ? -1 : 1;
  const containerRef = useRef<HTMLDivElement>(null);
  const overdueSignalCount = briefItems.filter(
    (item) => item.kind === "critical_risk" || item.kind === "at_risk",
  ).length;

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

  return (
    // No static `perspective` CSS here: it would establish a 3D
    // rendering context for every descendant (including the Radix
    // Popover trigger buttons inside RiskBadge/WorkloadBadge) even
    // when reduced motion removes the actual transform, which caused
    // a real Chromium compositing glitch found via visual
    // verification (the disclosure button rendered visually displaced
    // over sibling text). `transformPerspective` on the motion.div's
    // own style below is enough for the 3D tilt when motion is active.
    <div ref={containerRef} className="relative min-w-0 px-3 pt-3">
      {/* Layered backdrop fragment (Phase 13.6 §5/§6) — a second,
          smaller surface peeking out behind the main card, purely
          decorative, giving the composition depth beyond the single
          tilted card. Sized/positioned so it never extends past the
          column it sits in, even on narrow viewports. */}
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
          <span className="text-xs font-medium text-muted-foreground">Daily Brief</span>
          <span className="text-xs text-muted-foreground">Today</span>
        </div>

        <ul className="divide-y divide-border">
          {briefItems.slice(0, 3).map((item) => (
            <li key={item.id} className="flex items-start gap-2.5 p-3">
              <span
                className="mt-1 size-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: AMBIENT_ICON_BY_KIND[item.kind] }}
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

        {(topRisk || topWorkload) && (
          <div className="grid grid-cols-2 gap-3 border-t border-border p-3">
            {topRisk && (
              <div className="rounded-[var(--fp-radius-md)] border border-border p-2.5">
                <p className="mb-1.5 truncate text-xs text-muted-foreground">
                  {topRisk.project.name}
                </p>
                <Badge tone={topRisk.risk.level === "critical_risk" ? "danger" : "warning"}>
                  {topRisk.risk.level === "critical_risk" ? "Critical Risk" : "At Risk"}
                </Badge>
              </div>
            )}
            {topWorkload && (
              <div className="rounded-[var(--fp-radius-md)] border border-border p-2.5">
                <p className="mb-1.5 truncate text-xs text-muted-foreground">
                  {topWorkload.member.name}
                </p>
                <Badge tone={WORKLOAD_TONE[topWorkload.workload.band] ?? "neutral"}>
                  {topWorkload.workload.band} · {Math.round(topWorkload.workload.workloadPct)}%
                </Badge>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Floating operational signal (Phase 13.6 §6) — a small chip
          overlapping the card's top edge, echoing the Dashboard's own
          at-risk count without duplicating business logic (it's just
          a count of the same briefItems already passed in). Rendered
          as a sibling of the card, not a child, since the card itself
          is `overflow-hidden` and would clip anything meant to float
          past its own edge. */}
      {overdueSignalCount > 0 && (
        <div
          aria-hidden="true"
          className="absolute top-0 end-6 z-10 flex items-center gap-1 rounded-full border border-border bg-[var(--fp-bg-surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--fp-danger)] shadow-[var(--fp-shadow-level-1)]"
        >
          <AlertTriangle className="size-3" aria-hidden="true" />
          {overdueSignalCount} need attention
        </div>
      )}
    </div>
  );
}
