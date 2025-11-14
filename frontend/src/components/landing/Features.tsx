const features = [
  {
    title: 'NLP to workflow in seconds',
    description:
      'Describe your goal in natural language and let Gemini Flash design the full automation blueprint for n8n.',
  },
  {
    title: 'Enterprise-grade governance',
    description:
      'Track credentials, review execution history, and enforce compliance for Zendesk, Dynamics 365, and Salesforce.',
  },
  {
    title: 'Realtime collaboration',
    description:
      'Co-create workflows with teammates, annotate steps, and publish shared automation playbooks.',
  },
  {
    title: 'Unified CRM automations',
    description:
      'Blend tickets, cases, and incidents from Zendesk, Microsoft Dynamics 365, and Salesforce into one AI triage stream.',
  },
];

export const Features = () => (
  <section className="py-3xl grid gap-2xl">
    <header className="text-center grid gap-sm">
      <h2 className="text-h2 font-semibold text-neutral-white">Build automations without the drag</h2>
      <p className="text-body text-neutral-gray300">
        Everything you need to ideate, validate, and deploy AI-powered workflows from one place.
      </p>
    </header>
    <div className="grid gap-xl md:grid-cols-2 xl:grid-cols-4">
      {features.map((feature) => (
        <article key={feature.title} className="bg-neutral-dark rounded-lg p-2xl shadow-lg shadow-black/20 grid gap-md">
          <h3 className="text-h3 font-semibold text-neutral-white">{feature.title}</h3>
          <p className="text-body text-neutral-gray300">{feature.description}</p>
        </article>
      ))}
    </div>
  </section>
);
