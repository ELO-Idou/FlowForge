import type {
  GeneratedWorkflow,
  WorkflowBlueprint,
  WorkflowConnections,
  WorkflowCredentialTip,
  WorkflowStepDetail,
} from '../types/workflow.types';
import type { N8NEdge, N8NNode } from '../types/n8n.types';

const BASE_NODE_X = 120;
const BASE_NODE_Y = 180;
const NODE_X_OFFSET = 260;
const NODE_Y_OFFSET = 160;

const formatParameters = (parameters: Record<string, unknown>): string => {
  const entries = Object.entries(parameters ?? {});
  if (!entries.length) {
    return 'Auto-generated configuration for this step.';
  }

  const preview = entries
    .slice(0, 3)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(', ');

  return `Configured with ${preview}${entries.length > 3 ? ', ...' : ''}.`;
};

const buildNodes = (steps: WorkflowBlueprint['steps']): N8NNode[] =>
  steps.map((step, index) => ({
    id: step.id,
    name: step.name,
    type: step.type,
    parameters: step.parameters,
    position: {
      x: step.position?.x ?? BASE_NODE_X + (index % 3) * NODE_X_OFFSET,
      y: step.position?.y ?? BASE_NODE_Y + Math.floor(index / 3) * NODE_Y_OFFSET,
    },
  }));

const buildStepDetails = (steps: WorkflowBlueprint['steps']): WorkflowStepDetail[] =>
  steps.map((step, index) => ({
    stepNumber: index + 1,
    title: step.name,
    description: formatParameters(step.parameters),
    nodeId: step.id,
  }));

const buildEdges = (
  edges: WorkflowBlueprint['edges'],
  nodesById: Record<string, N8NNode>,
): N8NEdge[] =>
  edges.map((edge) => ({
    id: edge.id,
    source: nodesById[edge.source]?.name ?? edge.source,
    target: nodesById[edge.target]?.name ?? edge.target,
    metadata: {},
    connectionType: edge.connectionType,
    sourceOutputIndex: edge.sourceOutputIndex,
    targetInputIndex: edge.targetInputIndex,
  }));

const buildConnections = (
  edges: WorkflowBlueprint['edges'],
  nodesById: Record<string, N8NNode>,
): WorkflowConnections => {
  const connections: WorkflowConnections = {};

  edges.forEach((edge) => {
    const sourceNode = nodesById[edge.source];
    const targetNode = nodesById[edge.target];
    const sourceKey = sourceNode?.name ?? edge.source;
    const targetKey = targetNode?.name ?? edge.target;
    const connectionType = edge.connectionType ?? 'main';
    const sourceOutputIndex = edge.sourceOutputIndex ?? 0;
    const targetInputIndex = edge.targetInputIndex ?? 0;

    if (!connections[sourceKey]) {
      connections[sourceKey] = {};
    }
    if (!connections[sourceKey][connectionType]) {
      connections[sourceKey][connectionType] = [];
    }

    const typedConnections = connections[sourceKey][connectionType];
    while (typedConnections.length <= sourceOutputIndex) {
      typedConnections.push([]);
    }

    typedConnections[sourceOutputIndex].push({
      node: targetKey,
      type: connectionType,
      index: targetInputIndex,
    });
  });

  return connections;
};

const buildCredentials = (credentials: string[]): WorkflowCredentialTip[] =>
  credentials.map((name) => ({
    name: String(name),
    reason: 'Required to execute this automation securely.',
  }));

export const toGeneratedWorkflow = (
  blueprint: WorkflowBlueprint,
): GeneratedWorkflow => {
  const nodes = buildNodes(blueprint.steps);
  const nodesById = nodes.reduce<Record<string, N8NNode>>((acc, node) => {
    acc[node.id] = node;
    return acc;
  }, {});

  const stepDetails = buildStepDetails(blueprint.steps);
  const edges = buildEdges(blueprint.edges, nodesById);
  const connections = buildConnections(blueprint.edges, nodesById);
  const credentials = buildCredentials(blueprint.credentials);

  return {
    name: blueprint.title,
    description: blueprint.description,
    nodes,
    edges,
    connections,
    steps: stepDetails,
    credentials,
    estimatedTimeSavedMinutes: blueprint.estimatedTimeSavedMinutes,
  };
};
