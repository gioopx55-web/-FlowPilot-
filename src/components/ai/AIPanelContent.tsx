"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import type { AIAnswer } from "@/domain/ai/executeIntent";
import { AI_QUICK_ACTIONS } from "@/domain/ai/intents";
import type { AIIntentId, AIScope } from "@/domain/ai/intents";
import { runAIIntentAction, runAIQueryAction } from "@/lib/aiActions";
import { useShellPanels } from "@/components/shell/panel-context";
import { AIAnswerView } from "@/components/ai/AIAnswerView";
import { Button } from "@/components/ui/button";

interface AIMessage {
  id: string;
  role: "user" | "assistant";
  text?: string;
  answer?: AIAnswer;
}

let messageCounter = 0;
function nextMessageId(): string {
  messageCounter += 1;
  return `ai_msg_${messageCounter}`;
}

function scopeLabelFromAnswer(answer: AIAnswer): string | undefined {
  if (answer.kind === "project_summary" || answer.kind === "project_risk_explanation") {
    return answer.data.project.name;
  }
  if (answer.kind === "team_member_workload_explanation") {
    return answer.data.member.name;
  }
  return undefined;
}

/**
 * The AI Assistant panel body (Phase 13 §1-§3/§23). Rendered inside
 * the existing global `SidePanel` (Phase 5) — this component owns
 * only the conversation UI; all answers come from `runAIIntentAction`/
 * `runAIQueryAction` (Server Actions over `domain/ai/*`), never
 * computed here.
 *
 * Conversation state is plain `useState` (Phase 13 §13) — a
 * lightweight, current-session-only history. It resets on panel
 * close/reopen, same as any other ephemeral UI state; nothing is
 * persisted via the `AIConversation`/`AIMessage` entities or the
 * D-039 demo-state layer, since V1 doesn't need chat history to
 * survive a reload (see DECISIONS.md).
 */
export function AIPanelContent() {
  const { aiPendingRequest, clearAIPendingRequest, openPanelId } = useShellPanels();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [activeScope, setActiveScope] = useState<AIScope | undefined>(undefined);
  const [activeScopeLabel, setActiveScopeLabel] = useState<string | undefined>(undefined);
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const processedRequestRef = useRef<typeof aiPendingRequest>(null);

  function appendAnswer(userText: string, answer: AIAnswer) {
    const label = scopeLabelFromAnswer(answer);
    if (label) {
      const scope: AIScope | undefined =
        answer.kind === "team_member_workload_explanation"
          ? { kind: "team_member", id: answer.data.member.id }
          : answer.kind === "project_summary" || answer.kind === "project_risk_explanation"
            ? { kind: "project", id: answer.data.project.id }
            : undefined;
      setActiveScope(scope);
      setActiveScopeLabel(label);
    }
    setMessages((prev) => [
      ...prev,
      { id: nextMessageId(), role: "user", text: userText },
      { id: nextMessageId(), role: "assistant", answer },
    ]);
  }

  function runQuickAction(intentId: AIIntentId, label: string) {
    startTransition(async () => {
      const answer = await runAIIntentAction(intentId, activeScope);
      appendAnswer(label, answer);
    });
  }

  function submitFreeText(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    startTransition(async () => {
      const answer = await runAIQueryAction(text, activeScope);
      appendAnswer(text, answer);
    });
  }

  function clearConversation() {
    setMessages([]);
    setActiveScope(undefined);
    setActiveScopeLabel(undefined);
  }

  // Consume a contextual entry point (Project Detail "Summarize"/"Explain
  // risk", Team Member "Explain workload") exactly once when it fires.
  useEffect(() => {
    if (!aiPendingRequest || openPanelId !== "ai") return;
    // Guards against React Strict Mode's dev-only double-invoke (and any
    // other re-run before `clearAIPendingRequest`'s state update lands)
    // re-appending the same contextual request twice.
    if (processedRequestRef.current === aiPendingRequest) return;
    processedRequestRef.current = aiPendingRequest;

    const { intentId, scope, label } = aiPendingRequest;
    startTransition(async () => {
      const answer = await runAIIntentAction(intentId, scope);
      appendAnswer(label, answer);
    });
    clearAIPendingRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiPendingRequest, openPanelId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <p className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="size-3.5" aria-hidden="true" />
        Demo AI — powered by workspace rules, not a live model.
      </p>

      {activeScopeLabel && (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-sm border border-border bg-accent px-2.5 py-1.5 text-xs">
          <span className="truncate text-foreground">Scoped to {activeScopeLabel}</span>
          <button
            type="button"
            onClick={() => {
              setActiveScope(undefined);
              setActiveScopeLabel(undefined);
            }}
            className="shrink-0 rounded-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            Clear
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-foreground">
              What can I help with?
            </h2>
            <div className="flex flex-col gap-1.5">
              {AI_QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.intentId}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-auto justify-start whitespace-normal py-1.5 text-start"
                  disabled={isPending}
                  onClick={() => runQuickAction(action.intentId, action.label)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) =>
              message.role === "user" ? (
                <p key={message.id} className="text-sm font-medium text-foreground">
                  {message.text}
                </p>
              ) : (
                <div key={message.id}>{message.answer && <AIAnswerView answer={message.answer} />}</div>
              ),
            )}
            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearConversation}
                className="rounded-sm text-xs text-muted-foreground outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring/70"
              >
                Clear conversation
              </button>
            )}
          </>
        )}
      </div>

      <form onSubmit={submitFreeText} className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about risk, overdue tasks, workload…"
          aria-label="Ask the AI Assistant"
          disabled={isPending}
          className="h-9 flex-1 rounded-sm border border-border bg-background px-2.5 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
        />
        <Button type="submit" size="sm" disabled={isPending || !inputValue.trim()}>
          {isPending ? "Thinking…" : "Ask"}
        </Button>
      </form>
    </div>
  );
}
