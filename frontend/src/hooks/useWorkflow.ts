import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendGeminiPrompt } from '../services/gemini';
import { generateFailure, generateStart, generateSuccess } from '../features/workflow/workflowSlice';
import { selectWorkflowState } from '../types/workflow.types';
import type { AppDispatch } from '../store';

export const useWorkflow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector(selectWorkflowState);

  const generateWorkflow = useCallback(async (prompt: string) => {
    dispatch(generateStart());
    try {
      const blueprint = await sendGeminiPrompt([
        { id: crypto.randomUUID(), role: 'user', content: prompt },
      ]);
      dispatch(generateSuccess(blueprint));
    } catch (error) {
      dispatch(generateFailure((error as Error).message));
    }
  }, [dispatch]);

  return { ...state, generateWorkflow };
};
