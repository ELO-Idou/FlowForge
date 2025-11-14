import type { WorkflowCredentialTip } from '../../types/workflow.types';

interface CredentialsGuideProps {
  credentials?: WorkflowCredentialTip[];
}

const fallbackCredentials: WorkflowCredentialTip[] = [
  {
    name: 'Zendesk API Key',
    reason: 'Grants access to ticket queues, requester profiles, and SLA metadata.',
  },
  {
    name: 'Microsoft Dynamics 365 OAuth',
    reason: 'Allows the workflow to poll incidents and field service cases securely.',
  },
  {
    name: 'Salesforce Connected App',
    reason: 'Enables retrieval of new Service Cloud cases with granular permissions.',
  },
  {
    name: 'Gemini 2.0 Flash',
    reason: 'Add an API key with write scope for workflow generation and summarization.',
  },
  {
    name: 'Slack Bot Token',
    reason: 'Posts enriched alerts into your escalation channel or war room.',
  },
];

export const CredentialsGuide = ({ credentials }: CredentialsGuideProps) => {
  const items = credentials?.length ? credentials : fallbackCredentials;

  return (
    <section className="grid gap-lg rounded-2xl border border-neutral-gray800 bg-neutral-darkest p-2xl">
      <h2 className="text-h3 font-semibold text-neutral-white">Credential checklist</h2>
      <ul className="grid gap-sm text-sm text-neutral-gray300">
        {items.map((item) => (
          <li key={item.name} className="rounded-xl border border-neutral-gray800/70 bg-neutral-dark/60 px-md py-sm">
            <span className="font-semibold text-neutral-white">{item.name}:</span> {item.reason}
          </li>
        ))}
      </ul>
    </section>
  );
};
