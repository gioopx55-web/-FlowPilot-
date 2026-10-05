"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EASE_OUT: [number, number, number, number] = [0, 0, 0.2, 1];

/**
 * The one scroll-reveal primitive every marketing section uses
 * (Phase 13.5 §4) — a restrained fade + small upward translate as the
 * section enters the viewport, never repeated (`viewport={{ once:
 * true }}`) so scrolling back up doesn't re-trigger it. Under
 * `prefers-reduced-motion: reduce`, content renders in its final
 * position immediately with no transform and only a minimal opacity
 * fade (Phase 13.5 §9) — nothing is ever hidden from a reduced-motion
 * visitor, only the motion itself is removed.
 */
export function RevealOnScroll({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
