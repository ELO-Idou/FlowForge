export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  connectionType?: string;
  sourceOutputIndex?: number;
  targetInputIndex?: number;
}
import { N8NNode, N8NEdge } from './n8n.types';

export interface GeminiChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

export interface GeminiWorkflowRequest {
  messages: GeminiChatMessage[];
}

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, unknown>;
  position?: {
    x: number;
    y: number;
  };
  typeVersion?: number;
  credentials?: Record<string, unknown>;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  continueOnFail?: boolean;
  notes?: string;
  notesInFlow?: boolean;
  disabled?: boolean;
}

export interface WorkflowBlueprint {
  id: string;
  title: string;
  description: string;
  steps: WorkflowNode[];
  edges: WorkflowEdge[];
  credentials: string[];
  estimatedTimeSavedMinutes: number;
}

export interface WorkflowState {
  status: 'idle' | 'loading' | 'succeeded' | 'error';
  currentBlueprint: WorkflowBlueprint | null;
  history: WorkflowBlueprint[];
  error: string | null;
}

export const selectWorkflowState = (state: { workflow: WorkflowState }) => state.workflow;

export interface WorkflowStepDetail {
  stepNumber: number;
  title: string;
  description: string;
  nodeId: string;
  learningTip?: string;
}

export interface WorkflowCredentialTip {
  name: string;
  reason: string;
}

export interface WorkflowConnectionTarget {
  node: string;
  type: string;
  index: number;
}

export type WorkflowConnections = Record<string, Record<string, WorkflowConnectionTarget[][]>>;

export interface GeneratedWorkflow {
  name: string;
  description: string;
  nodes: N8NNode[];
  edges?: N8NEdge[];
  connections?: WorkflowConnections;
  steps: WorkflowStepDetail[];
  credentials: WorkflowCredentialTip[];
  estimatedTimeSavedMinutes?: number;
}
