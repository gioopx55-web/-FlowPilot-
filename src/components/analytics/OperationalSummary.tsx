interface StatTile {
  label: string;
  value: string;
}

/**
 * Top operational summary row (Phase 11 §9) — small text stats, not
 * another wall of equal-sized cards. Every value here is read
 * straight from the same domain functions the sections below use;
 * this component formats, it doesn't compute.
 */
export function OperationalSummary({ stats }: { stats: StatTile[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-md border border-border p-3">
          <dt className="text-xs text-muted-foreground">{stat.label}</dt>
          <dd className="mt-1 text-xl font-semibold text-foreground">{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
