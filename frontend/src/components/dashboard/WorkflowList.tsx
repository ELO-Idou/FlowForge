const mockWorkflows = [
  {
    id: 'wf-1',
    name: 'Lead capture to CRM',
    status: 'Active',
    updatedAt: '2 hours ago',
  },
  {
    id: 'wf-2',
    name: 'Customer onboarding intel',
    status: 'Draft',
    updatedAt: 'Yesterday',
  },
];

export const WorkflowList = () => (
  <section className="grid gap-lg">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-h3 font-semibold text-neutral-white">Your workflows</h2>
        <p className="text-sm text-neutral-gray400">Monitor execution health and deployment status.</p>
      </div>
      <button className="text-sm text-primary-yellow">View all</button>
    </header>
    <div className="grid gap-sm">
      {mockWorkflows.map((workflow) => (
        <article
          key={workflow.id}
          className="bg-neutral-dark rounded-lg border border-neutral-gray800 px-2xl py-xl flex justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-neutral-white">{workflow.name}</h3>
            <p className="text-sm text-neutral-gray500">Last updated {workflow.updatedAt}</p>
          </div>
          <span className="text-sm text-neutral-gray300">{workflow.status}</span>
        </article>
      ))}
    </div>
  </section>
);
