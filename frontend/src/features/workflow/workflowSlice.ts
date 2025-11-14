import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkflowBlueprint, WorkflowState } from '../../types/workflow.types';

const initialState: WorkflowState = {
  status: 'idle',
  currentBlueprint: null,
  history: [],
  error: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    generateStart(state) {
      state.status = 'loading';
      state.error = null;
    },
    generateSuccess(state, action: PayloadAction<WorkflowBlueprint>) {
      state.status = 'succeeded';
      state.currentBlueprint = action.payload;
      state.history.unshift(action.payload);
    },
    generateFailure(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    resetCurrent(state) {
      state.currentBlueprint = null;
      state.status = 'idle';
    },
  },
});

export const { generateStart, generateSuccess, generateFailure, resetCurrent } = workflowSlice.actions;
export default workflowSlice.reducer;
