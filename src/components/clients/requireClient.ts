import { notFound } from "next/navigation";
import { getClientById } from "@/domain/selectors";
import type { Client } from "@/types/entities";

/**
 * Same guard pattern as components/projects/requireProject.ts
 * (DECISIONS.md D-036, binding): every client-scoped entry point
 * (layout + every tab) must call this itself, since Next can render a
 * layout and its page concurrently — the layout's notFound() alone
 * does not reliably stop a child page from independently calling a
 * selector that throws on an unknown ID.
 */
export function requireClient(clientId: string): Client {
  const client = getClientById(clientId);
  if (!client) {
    notFound();
  }
  return client;
}
