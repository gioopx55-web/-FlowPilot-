import { getDemoDataset } from "@/data/mock";
import { Section } from "@/components/primitives/Section";
import { Button } from "@/components/ui/button";

const INCLUDED_CAPABILITIES = [
  "Unlimited demo projects and tasks",
  "Client and team workspace views",
  "Analytics dashboards",
  "AI assistant preview",
];

/**
 * Billing (Phase 14 §13) — presentation-only. Truthful: a plan label,
 * what's included, a real usage summary pulled from the demo dataset,
 * and an honestly-disabled "Manage billing" action. No Stripe, no
 * checkout, no card fields, no fake invoices or payment history —
 * none of that exists, so none of it is simulated here.
 */
export default function BillingSettingsPage() {
  const { teamMembers, projects, clients } = getDemoDataset();

  return (
    <Section title="Billing">
      <div className="max-w-md space-y-6">
        <div>
          <span className="text-xs text-muted-foreground">Current plan</span>
          <p className="mt-1 text-sm font-medium text-foreground">Demo / Pro Preview</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Billing is disabled in this demo — there is no real subscription or payment method.
          </p>
        </div>

        <div>
          <span className="text-xs text-muted-foreground">Included in this preview</span>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {INCLUDED_CAPABILITIES.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>

        <div>
          <span className="text-xs text-muted-foreground">Workspace usage</span>
          <p className="mt-1 text-sm text-foreground">
            {teamMembers.length} team members · {projects.length} projects · {clients.length}{" "}
            clients
          </p>
        </div>

        <div>
          <Button type="button" size="sm" variant="secondary" disabled title="Billing is disabled in demo">
            Manage billing
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Billing is disabled in demo — no payment method or invoices exist.
          </p>
        </div>
      </div>
    </Section>
  );
}
