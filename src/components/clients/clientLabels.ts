import type { ClientStatus, InteractionType } from "@/types/entities";

/** Presentation-layer label lookup, same pattern as projectLabels.ts/riskConditionLabels.ts. */
export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
  active: "Active",
  retainer: "Retainer",
  dormant: "Dormant",
};

export const INTERACTION_TYPE_LABEL: Record<InteractionType, string> = {
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  update_sent: "Update sent",
  note: "Note",
};
