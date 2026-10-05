"use server";

import { executeAIIntent, runAIQuery, type AIAnswer } from "@/domain/ai/executeIntent";
import type { AIIntentId, AIScope } from "@/domain/ai/intents";

/**
 * Server Action boundary for the AI Assistant (Phase 13 §23) — same
 * pattern as `lib/taskActions.ts`/`lib/clientActions.ts`: the client
 * panel never imports `domain/ai/*` directly, it calls these actions.
 * No mutation happens here (the AI only reads current state); there
 * is nothing to `revalidatePath` since nothing changes.
 */
export async function runAIIntentAction(
  intentId: AIIntentId,
  scope?: AIScope,
): Promise<AIAnswer> {
  return executeAIIntent(intentId, scope);
}

export async function runAIQueryAction(rawInput: string, activeScope?: AIScope): Promise<AIAnswer> {
  return runAIQuery(rawInput, activeScope);
}
