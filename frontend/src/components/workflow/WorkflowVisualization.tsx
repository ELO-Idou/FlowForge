import type { GeneratedWorkflow, WorkflowStepDetail } from '../../types/workflow.types';
import { StepCard } from './StepCard';

interface WorkflowVisualizationProps {
  workflow?: GeneratedWorkflow | null;
}

const fallbackSteps: WorkflowStepDetail[] = [
  {
    stepNumber: 1,
    title: 'Trigger: Webhook',
    description: 'Listen for new marketing qualified leads from landing page form submissions.',
    nodeId: 'mock-node-1',
  },
  {
    stepNumber: 2,
    title: 'Enrich: Gemini Flash',
    description: 'Summarize lead context and identify intent sentiment to personalize outreach cadence.',
    nodeId: 'mock-node-2',
  },
  {
    stepNumber: 3,
    title: 'Action: CRM Upsert',
    description: 'Create or update the contact in HubSpot with enriched metadata.',
    nodeId: 'mock-node-3',
  },
];

export const WorkflowVisualization = ({ workflow }: WorkflowVisualizationProps) => {
  const steps = workflow?.steps?.length ? workflow.steps : fallbackSteps;

  return (
    <section className="grid gap-lg">
      <header className="grid gap-xs">
        <h2 className="text-h3 font-semibold text-neutral-white">
          {workflow?.name ?? 'Workflow blueprint'}
        </h2>
        <p className="text-sm text-neutral-gray400">
          {workflow?.description ?? 'Automatically generated structure mapped to n8n nodes and edges.'}
        </p>
        {workflow?.estimatedTimeSavedMinutes ? (
          <span className="w-fit rounded-full border border-primary-yellow/40 bg-primary-yellow/10 px-md py-xs text-xs font-semibold text-primary-yellow">
            ~{workflow.estimatedTimeSavedMinutes} min saved per week
          </span>
        ) : null}
      </header>
  <div className="grid gap-lg md:grid-cols-3 mt-lg">
        {steps.map((step) => (
          <StepCard
            key={step.nodeId}
            stepNumber={step.stepNumber}
            title={step.title}
            description={step.description}
            learningTip={step.learningTip}
          />
        ))}
      </div>
    </section>
  );
};
