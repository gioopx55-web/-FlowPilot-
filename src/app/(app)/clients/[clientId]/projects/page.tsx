import { ClientProjectsTab } from "@/components/clients/ClientProjectsTab";

export default async function ClientProjectsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  return <ClientProjectsTab clientId={clientId} />;
}
