import { useState } from 'react';

import { Button } from '../common/Button';
import type { GeneratedWorkflow, WorkflowBlueprint } from '../../types/workflow.types';
import { convertWorkflow, deployWorkflow } from '../../features/workflow/workflowAPI';

interface N8NExportProps {
  workflow?: GeneratedWorkflow | null;
  blueprint?: WorkflowBlueprint | null;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'workflow-blueprint';

export const N8NExport = ({ workflow, blueprint }: N8NExportProps) => {
  const canExport = Boolean(workflow && blueprint);
  const workflowName = workflow?.name;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleDownload = async () => {
    if (!blueprint || !workflowName) {
      return;
    }

    try {
      setIsDownloading(true);
      const converted = await convertWorkflow(blueprint);
      const payload = JSON.stringify(converted, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slugify(workflowName)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to convert workflow for n8n export', error);
      window.alert('Unable to prepare the workflow for download. Please try again in a moment.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenN8N = async () => {
    if (!canExport || !blueprint) {
      return;
    }

    const n8nUrl = import.meta.env.VITE_N8N_URL ?? 'http://localhost:5678';
    try {
      setIsPublishing(true);
      const result = await deployWorkflow(blueprint);
      const normalizedBase = n8nUrl.replace(/\/?$/, '');
      const workflowUrl = result?.id
        ? `${normalizedBase}/workflow/${result.id}`
        : result?.url ?? normalizedBase;
      window.open(workflowUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to deploy workflow to n8n', error);
      window.alert('Unable to deploy the workflow to n8n. Check your API key and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <section className="grid gap-lg rounded-2xl border border-neutral-gray800 bg-neutral-dark p-2xl">
      <header className="grid gap-xs">
        <h2 className="text-h3 font-semibold text-neutral-white">Deploy to n8n</h2>
        <p className="text-sm text-neutral-gray400">
          {workflowName
            ? `Workflow "${workflowName}" is ready. Review credentials, confirm environment, then launch the automation.`
            : 'Review credentials, confirm environment, then launch the automation.'}
        </p>
      </header>
      <ol className="list-inside list-decimal grid gap-sm text-sm text-neutral-gray200">
        <li>Download the generated workflow JSON and import it into your n8n workspace.</li>
        <li>Add the credentials highlighted above to each trigger and action before activating the flow.</li>
        <li>Run a dry-run execution with sample payloads to validate mappings and summaries.</li>
        <li>Enable monitoring to capture execution logs, case volume trends, and SLA insights for the demo.</li>
      </ol>
      <div className="flex justify-end gap-sm">
        <Button variant="ghost" disabled={!canExport || isDownloading || isPublishing} onClick={handleDownload}>
          {isDownloading ? 'Preparing…' : 'Download JSON'}
        </Button>
        <Button variant="primary" disabled={!canExport || isPublishing} onClick={handleOpenN8N}>
          {isPublishing ? 'Deploying…' : 'Open in n8n'}
        </Button>
      </div>
    </section>
  );
};
