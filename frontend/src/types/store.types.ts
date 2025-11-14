import type { AuthState } from './auth.types';
import type { WorkflowState } from './workflow.types';

export interface RootState {
  auth: AuthState;
  workflow: WorkflowState;
}
