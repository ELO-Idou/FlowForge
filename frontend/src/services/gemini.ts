import { apiClient } from './api';
import { GeminiChatMessage, GeminiWorkflowRequest, WorkflowBlueprint } from '../types/workflow.types';

export const sendGeminiPrompt = async (
  messages: GeminiChatMessage[],
): Promise<WorkflowBlueprint> => {
  const response = await apiClient.post<WorkflowBlueprint>('/chat/gemini', {
    messages,
  } satisfies GeminiWorkflowRequest);
  return response.data;
};
