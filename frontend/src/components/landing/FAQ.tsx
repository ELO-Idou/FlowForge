const faqs = [
  {
    question: 'How does the chat build workflows?',
    answer: 'We parse your natural language prompt with Gemini 2.0 Flash and map the output into n8n-compatible nodes.',
  },
  {
    question: 'Can I reuse existing automations?',
    answer: 'Yes, import JSON or sync directly from your n8n instance to version workflows collaboratively.',
  },
  {
    question: 'Is my data compliant?',
    answer: 'All prompts and execution data follow GDPR standards with encryption at rest and in transit.',
  },
];

export const FAQ = () => (
  <section className="py-3xl grid gap-xl">
    <header className="text-center grid gap-sm">
      <h2 className="text-h2 font-semibold text-neutral-white">FAQ</h2>
      <p className="text-body text-neutral-gray300">Answers to the most common automation questions.</p>
    </header>
    <div className="grid gap-lg">
      {faqs.map((faq) => (
        <article key={faq.question} className="bg-neutral-dark rounded-xl border border-neutral-gray800 p-2xl">
          <h3 className="text-lg font-semibold text-neutral-white">{faq.question}</h3>
          <p className="text-sm text-neutral-gray300 mt-sm">{faq.answer}</p>
        </article>
      ))}
    </div>
  </section>
);
