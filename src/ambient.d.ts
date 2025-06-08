type EdgeType = {
  fromId: string;
  toId: string;
  edgeId: string;
};

type VertexType = {
  id: string;
  humanName: string;
  codeName: string;
  output: string;
  type: 'operation' | 'data' | 'output';
  connectsTo: string[];
  accepts: string[];
};

type VertexRectType = {
  vertexId: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type PcaNodeType = {
  id: string;
  inputs: string[][];
  outputs: string[];
};
