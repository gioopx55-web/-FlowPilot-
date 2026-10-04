import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shell-level route-transition loading state — Phase 4 §15.10, Phase 5 §26.
 * Matches the shell's own structure rather than a generic spinner. No
 * feature-data loading states exist yet (no feature fetches data in
 * Phase 5).
 */
export default function AppLoading() {
  return (
    <div className="space-y-3 p-6">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-4 w-full max-w-sm" />
    </div>
  );
}
