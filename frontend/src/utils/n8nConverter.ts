import { WorkflowBlueprint } from '../types/workflow.types';

export const toN8NWorkflowJSON = (blueprint: WorkflowBlueprint) => ({
  meta: {
    generatedAt: new Date().toISOString(),
    generatedBy: 'Gemini 2.0 Flash',
  },
  nodes: blueprint.steps,
  connections: blueprint.edges.reduce<Record<string, { main: Array<{ node: string; type: string; index: number }> }>>(
    (accumulator, edge) => {
      const source = accumulator[edge.source] ?? { main: [] };
      source.main.push({ node: edge.target, type: 'main', index: 0 });
      return { ...accumulator, [edge.source]: source };
    },
    {},
  ),
});
