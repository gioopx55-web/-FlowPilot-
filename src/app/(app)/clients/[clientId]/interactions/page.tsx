import { ClientInteractionsTab } from "@/components/clients/ClientInteractionsTab";

export default async function ClientInteractionsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientInteractionsTab clientId={clientId} />;
}
