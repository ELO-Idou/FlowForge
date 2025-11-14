export interface N8NNode {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, unknown>;
  position: {
    x: number;
    y: number;
  };
}

export interface N8NEdge {
  id: string;
  source: string;
  target: string;
  metadata?: Record<string, unknown>;
  connectionType?: string;
  sourceOutputIndex?: number;
  targetInputIndex?: number;
}
