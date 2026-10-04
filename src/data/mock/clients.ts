import type { Client } from "@/types/entities";
import { WORKSPACE_ID } from "@/data/mock/workspace";

/**
 * 15 fictional small-business clients. All names/contacts are
 * clearly invented demo data — no real company is referenced or
 * implied (Constitution content guardrails, PROJECT_PLAN.md §7).
 *
 * `lastInteractionAt` is intentionally omitted here — per Phase 6's
 * client follow-up requirement, it is never hand-authored. It is
 * derived from ClientInteraction records by
 * `domain/clients/deriveClientFields.ts` and attached only through
 * that controlled process (see `data/mock/index.ts`).
 *
 * Status mix: 3 dormant (excluded from follow-up surfacing — D- see
 * domain/clients/followUp.ts), the rest active/retainer with
 * deliberately varied interaction recency (client-interactions.ts)
 * so some need follow-up and some don't.
 */
export const clients: Client[] = [
  {
    id: "cl_harbor_thistle",
    workspaceId: WORKSPACE_ID,
    name: "Harbor & Thistle",
    status: "active",
    primaryContactName: "Noor Abiodun",
    primaryContactEmail: "noor@harborthistle.example",
    createdAt: "2024-03-01T09:00:00.000Z",
  },
  {
    id: "cl_lumen_analytics",
    workspaceId: WORKSPACE_ID,
    name: "Lumen Analytics",
    status: "active",
    primaryContactName: "Dev Patel",
    primaryContactEmail: "dev@lumenanalytics.example",
    createdAt: "2024-04-10T09:00:00.000Z",
  },
  {
    id: "cl_cedar_grove",
    workspaceId: WORKSPACE_ID,
    name: "Cedar Grove Dental",
    status: "retainer",
    primaryContactName: "Dr. Amelia Ross",
    primaryContactEmail: "amelia@cedargrovedental.example",
    createdAt: "2023-11-20T09:00:00.000Z",
  },
  {
    id: "cl_pixel_forge",
    workspaceId: WORKSPACE_ID,
    name: "Pixel Forge Games",
    status: "active",
    primaryContactName: "Sam Okafor",
    primaryContactEmail: "sam@pixelforgegames.example",
    createdAt: "2024-06-05T09:00:00.000Z",
  },
  {
    id: "cl_rook_raven",
    workspaceId: WORKSPACE_ID,
    name: "Rook & Raven Coffee",
    status: "retainer",
    primaryContactName: "Lena Brandt",
    primaryContactEmail: "lena@rookravencoffee.example",
    createdAt: "2023-09-12T09:00:00.000Z",
  },
  {
    id: "cl_solstice_yoga",
    workspaceId: WORKSPACE_ID,
    name: "Solstice Yoga Collective",
    status: "active",
    primaryContactName: "Priyanka Desai",
    primaryContactEmail: "priyanka@solsticeyoga.example",
    createdAt: "2024-05-18T09:00:00.000Z",
  },
  {
    id: "cl_mariner_logistics",
    workspaceId: WORKSPACE_ID,
    name: "Mariner Logistics Co.",
    status: "retainer",
    primaryContactName: "Carlos Ibarra",
    primaryContactEmail: "carlos@marinerlogistics.example",
    createdAt: "2023-07-02T09:00:00.000Z",
  },
  {
    id: "cl_fernwood",
    workspaceId: WORKSPACE_ID,
    name: "Fernwood Nonprofit Alliance",
    status: "active",
    primaryContactName: "Grace Muthoni",
    primaryContactEmail: "grace@fernwoodalliance.example",
    createdAt: "2024-02-14T09:00:00.000Z",
  },
  {
    id: "cl_brightline",
    workspaceId: WORKSPACE_ID,
    name: "Brightline Fintech",
    status: "active",
    primaryContactName: "Hana Kobayashi",
    primaryContactEmail: "hana@brightlinefintech.example",
    createdAt: "2024-07-22T09:00:00.000Z",
  },
  {
    // Dormant — excluded from follow-up surfacing regardless of interaction age.
    id: "cl_thistlewood",
    workspaceId: WORKSPACE_ID,
    name: "Thistlewood Interiors",
    status: "dormant",
    primaryContactName: "Rowan Fitzgerald",
    primaryContactEmail: "rowan@thistlewoodinteriors.example",
    createdAt: "2022-10-01T09:00:00.000Z",
  },
  {
    // Dormant — excluded from follow-up surfacing regardless of interaction age.
    id: "cl_quillpoint",
    workspaceId: WORKSPACE_ID,
    name: "Quillpoint Publishing",
    status: "dormant",
    primaryContactName: "Imogen Castellano",
    primaryContactEmail: "imogen@quillpointpublishing.example",
    createdAt: "2022-12-11T09:00:00.000Z",
  },
  {
    id: "cl_verdant_farms",
    workspaceId: WORKSPACE_ID,
    name: "Verdant Urban Farms",
    status: "active",
    primaryContactName: "Tomás Reyes",
    primaryContactEmail: "tomas@verdanturbanfarms.example",
    createdAt: "2024-08-01T09:00:00.000Z",
  },
  {
    id: "cl_nimbus_cloud",
    workspaceId: WORKSPACE_ID,
    name: "Nimbus Cloud Services",
    status: "retainer",
    primaryContactName: "Felix Granger",
    primaryContactEmail: "felix@nimbuscloudservices.example",
    createdAt: "2023-05-09T09:00:00.000Z",
  },
  {
    id: "cl_copperfield",
    workspaceId: WORKSPACE_ID,
    name: "Copperfield Realty Group",
    status: "active",
    primaryContactName: "Bianca Hallworth",
    primaryContactEmail: "bianca@copperfieldrealty.example",
    createdAt: "2024-01-30T09:00:00.000Z",
  },
  {
    // Dormant — excluded from follow-up surfacing regardless of interaction age.
    id: "cl_hearthstone",
    workspaceId: WORKSPACE_ID,
    name: "Hearthstone Family Clinic",
    status: "dormant",
    primaryContactName: "Dr. Owen Vance",
    primaryContactEmail: "owen@hearthstoneclinic.example",
    createdAt: "2023-02-17T09:00:00.000Z",
  },
];
