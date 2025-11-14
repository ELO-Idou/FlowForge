const steps = [
  {
    step: '01',
    title: 'Ideate in natural language',
    detail: 'Share your idea with the empathic chat assistant. It captures context, tooling, SLAs, and business rules.',
  },
  {
    step: '02',
    title: 'Review instant blueprint',
    detail: 'Watch the workflow map emerge with water-drop animations, complete with credentials, nodes, and edge logic.',
  },
  {
    step: '03',
    title: 'Launch in n8n',
    detail: 'Push the automation to n8n in a single click, add credentials, and monitor success metrics live.',
  },
];

export const HowItWorks = () => (
  <section className="py-3xl grid gap-2xl">
    <header className="text-center grid gap-sm">
      <h2 className="text-h2 font-semibold text-neutral-white">How it works</h2>
      <p className="text-body text-neutral-gray300">No more manual wiring. Let Gemini Flash orchestrate everything.</p>
    </header>
    <div className="grid gap-lg md:grid-cols-3">
      {steps.map((step) => (
        <article key={step.step} className="bg-neutral-dark rounded-xl p-2xl border border-neutral-gray800 grid gap-md">
          <span className="text-primary-yellow text-sm font-semibold">{step.step}</span>
          <h3 className="text-h3 font-semibold text-neutral-white">{step.title}</h3>
          <p className="text-body text-neutral-gray300">{step.detail}</p>
        </article>
      ))}
    </div>
  </section>
);
