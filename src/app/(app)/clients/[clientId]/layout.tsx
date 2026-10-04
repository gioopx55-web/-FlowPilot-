import { getClientDetail } from "@/domain/selectors";
import { requireClient } from "@/components/clients/requireClient";
import { ClientDetailHeader } from "@/components/clients/ClientDetailHeader";
import { ClientTabs } from "@/components/clients/ClientTabs";

/**
 * Shared header + route-backed tabs for every /clients/:clientId/*
 * route (Phase 10 §4-§5), same structure as the Project Detail
 * layout. An unknown clientId resolves to this segment's
 * not-found.tsx (see D-036 — this file calls requireClient(), which
 * calls notFound() from the layout, so not-found.tsx must live in the
 * PARENT `clients/` segment, not inside `[clientId]/`).
 */
export default async function ClientDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  requireClient(clientId);
  const detail = getClientDetail(clientId)!;

  return (
    <div>
      <ClientDetailHeader client={detail.client} followUp={detail.followUp} />
      <ClientTabs clientId={clientId} />
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}
