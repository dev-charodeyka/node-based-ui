type Edge = {
  fromId: string;
  toId: string;
  edgeId: string;
};

type Vertex = {
  id: string;
  humanName: string;
  codeName: string;
  output: string;
  type: 'operation' | 'data' | 'output';
  connectsTo: string[];
  accepts: string[];
};
