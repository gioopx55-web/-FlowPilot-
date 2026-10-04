import { ClientOverview } from "@/components/clients/ClientOverview";

export default async function ClientOverviewPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientOverview clientId={clientId} />;
}
