import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import workflowReducer from './features/workflow/workflowSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workflow: workflowReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
