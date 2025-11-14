const stats = [
  {
    label: 'Active automations',
    value: 24,
    trend: '+12% vs last week',
  },
  {
    label: 'Time saved this month',
    value: '184h',
    trend: '+32% efficiency',
  },
  {
    label: 'Run success rate',
    value: '99.4%',
    trend: '+0.8% vs target',
  },
];

export const StatsCards = () => (
  <section className="grid gap-lg md:grid-cols-3">
    {stats.map((stat) => (
      <article key={stat.label} className="bg-neutral-dark rounded-xl border border-neutral-gray800 p-2xl">
        <p className="text-sm text-neutral-gray400">{stat.label}</p>
        <p className="text-3xl font-semibold text-neutral-white">{stat.value}</p>
        <p className="text-sm text-semantic-success">{stat.trend}</p>
      </article>
    ))}
  </section>
);
