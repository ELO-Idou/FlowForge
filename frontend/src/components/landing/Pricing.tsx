const plans = [
  {
    name: 'Starter',
    price: '$49',
    cadence: 'per month',
    highlights: [
      'Unlimited workflow blueprints',
      'Up to 3 team members',
      'Community support',
    ],
  },
  {
    name: 'Growth',
    price: '$149',
    cadence: 'per month',
    highlights: [
      'Everything in Starter',
      'Advanced analytics dashboard',
      'n8n environment sync',
      'Priority chat support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Let’s talk',
    cadence: 'custom',
    highlights: [
      'Dedicated success manager',
      'Custom SLAs and integrations',
      'On-prem deployment options',
    ],
  },
];

export const Pricing = () => (
  <section className="py-4xl grid gap-2xl">
    <header className="text-center grid gap-sm">
      <h2 className="text-h2 font-semibold text-neutral-white">Pricing that scales with your automations</h2>
      <p className="text-body text-neutral-gray300">
        Flexible packages for startups to enterprise operations teams.
      </p>
    </header>
    <div className="grid gap-xl md:grid-cols-3">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className="bg-neutral-dark rounded-xl p-2xl border border-neutral-gray800 grid gap-lg"
        >
          <header className="grid gap-xs">
            <h3 className="text-h3 font-semibold text-neutral-white">{plan.name}</h3>
            <p className="text-body text-neutral-gray300">
              <span className="text-3xl font-bold text-primary-yellow">{plan.price}</span> {plan.cadence}
            </p>
          </header>
          <ul className="grid gap-sm text-neutral-gray100">
            {plan.highlights.map((highlight) => (
              <li key={highlight}>• {highlight}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);
