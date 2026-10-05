import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RevealOnScroll } from "@/components/marketing/RevealOnScroll";

export function FinalCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <RevealOnScroll className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          See it running on a real workspace.
        </h2>
        <p className="mt-3 text-base text-muted-foreground">
          The demo is a fully working copy of FlowPilot AI, seeded with a realistic
          agency workspace — real risk, real workload, real follow-ups.
        </p>
        <div className="mt-7 flex justify-center">
          <Button asChild size="lg">
            <Link href="/login">Open FlowPilot Demo</Link>
          </Button>
        </div>
      </RevealOnScroll>
    </section>
  );
}
