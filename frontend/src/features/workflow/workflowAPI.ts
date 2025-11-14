import { apiClient } from '../../services/api';
import { GeminiWorkflowRequest, WorkflowBlueprint } from '../../types/workflow.types';

export const generateWorkflow = async (payload: GeminiWorkflowRequest) => {
  const response = await apiClient.post<WorkflowBlueprint>('/chat/generate-workflow', payload);
  return response.data;
};

export const convertWorkflow = async (payload: WorkflowBlueprint) => {
  const response = await apiClient.post<{ workflow: object }>('/n8n/convert', payload);
  return response.data.workflow;
};

export const deployWorkflow = async (payload: WorkflowBlueprint) => {
  const response = await apiClient.post<{ workflow: { id: string; url?: string } }>('/n8n/workflows', payload);
  return response.data.workflow;
};
