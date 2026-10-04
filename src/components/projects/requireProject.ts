import { notFound } from "next/navigation";
import { getProjectById } from "@/domain/selectors";
import type { Project } from "@/types/entities";

/**
 * Next.js can render a route's layout and page concurrently, so the
 * layout alone calling `notFound()` does not reliably stop a child
 * page from independently calling a selector that throws on an
 * unknown ID (found via Phase 8 visual verification: an invalid
 * projectId produced a silent blank page with a server-side error
 * logged, not the not-found UI). Every project-scoped entry point
 * (layout + all four tabs) must call this same guard itself, since
 * `notFound()` must be called from next/navigation (UI-layer), not
 * from the framework-agnostic domain layer.
 */
export function requireProject(projectId: string): Project {
  const project = getProjectById(projectId);
  if (!project) {
    notFound();
  }
  return project;
}
