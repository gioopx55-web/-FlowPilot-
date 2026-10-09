"use client";

import { useState, useTransition } from "react";
import type { InteractionType } from "@/types/entities";
import { addClientInteractionAction } from "@/lib/clientActions";
import { DEMO_CURRENT_USER_ID } from "@/lib/demo-user";
import { INTERACTION_TYPE_LABEL } from "@/components/clients/clientLabels";
import { Button } from "@/components/ui/button";

const INTERACTION_TYPES: InteractionType[] = [
  "call",
  "email",
  "meeting",
  "update_sent",
  "note",
];

const fieldClassName =
  "w-full rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70";

/**
 * Add Interaction form (Phase 10 §9-§10). A plain native controlled
 * form, not React Hook Form + Zod — three fields and one validation
 * rule (summary required) don't justify a form library; this mirrors
 * TaskDetailContent.tsx's established native-input pattern. See
 * DECISIONS.md for this choice.
 *
 * On success, revalidatePath (inside the Server Action) refreshes
 * every Server Component reading this client's data — the interaction
 * list, lastInteractionAt, follow-up status, and the Dashboard's
 * Clients Needing Follow-Up all update through that one path, with no
 * manual per-view patching here.
 */
export function AddInteractionForm({ clientId }: { clientId: string }) {
  const [type, setType] = useState<InteractionType>("call");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setError(undefined);
    startTransition(async () => {
      const result = await addClientInteractionAction(
        clientId,
        type,
        summary,
        DEMO_CURRENT_USER_ID,
      );
      if (!result.ok) {
        setError(result.error ?? "Could not add this interaction.");
        return;
      }
      setSummary("");
      setType("call");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-md border border-border p-4">
      <h2 className="text-sm font-semibold text-foreground">Add interaction</h2>

      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <div>
          <label htmlFor="interaction-type" className="mb-1 block text-xs text-muted-foreground">
            Type
          </label>
          <select
            id="interaction-type"
            className={fieldClassName}
            value={type}
            onChange={(e) => setType(e.target.value as InteractionType)}
          >
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {INTERACTION_TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="interaction-summary" className="mb-1 block text-xs text-muted-foreground">
            Summary
          </label>
          <textarea
            id="interaction-summary"
            className={fieldClassName}
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="What happened?"
          />
        </div>
      </div>

      {error && <p className="text-xs text-[var(--fp-critical)]">{error}</p>}

      <Button type="submit" size="sm" disabled={isPending || !summary.trim()}>
        {isPending ? "Adding…" : "Add interaction"}
      </Button>
    </form>
  );
}
