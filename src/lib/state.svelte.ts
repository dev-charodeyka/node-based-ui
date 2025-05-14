import vertices from '$lib/alg/vertices';

//////////////////////////////State: Slected Vertices (Added to Code Editor Area) ////////////////////////

// creating a vertex map to enable fast lookups for checking whether a vertex is selected (=placed in the Code Editor Div)
//using Svelte 5 $state rune, that acts as Svelte 4 store
let verticesInCodeEditorMap = $state<Record<string, boolean>>(
  Object.fromEntries(vertices.map((vertex) => [vertex.id, false]))
);

// deriving 2 reactive arrays from the $state: one for vertices that are selected (in the Code Editor Div) and one for those that are not
//using Svelte 5 $derived.by rune, that acts as Svelte 4 derived store
let verticesCodeEditorState = $derived.by(() => {
  const verticesIn: { vertex: VertexType; isVertexIn: true }[] = [];
  const verticesOut: { vertex: VertexType; isVertexIn: false }[] = [];

  for (const vertex of vertices) {
    const isInCodeEditor = verticesInCodeEditorMap[vertex.id] === true;
    if (isInCodeEditor) {
      verticesIn.push({ vertex, isVertexIn: true });
    } else {
      verticesOut.push({ vertex, isVertexIn: false });
    }
  }
  return { verticesIn, verticesOut };
});

// in Svelte 5 $state variables cannot be reassigned from other components - they are read-only
// to modify them from outside export functions that encapsulate updates are used
function updVerticesCodeEditorState(vertexId: string, inCodeEditor: boolean) {
  verticesInCodeEditorMap[vertexId] = inCodeEditor;
}

export function getVerticesInCodeEditor(inCodeEditor: boolean) {
  const { verticesIn, verticesOut } = verticesCodeEditorState;
  return inCodeEditor ? verticesIn : verticesOut;
}

export function addVertexToCodeEditor(vertexId: string) {
  updVerticesCodeEditorState(vertexId, true);
}

export function deleteVertexFromCodeEditor(vertexId: string) {
  updVerticesCodeEditorState(vertexId, false);
}

//////////////////////////State: Selected Data Vertex (Only one vertex of type 'data' can be selected at a time) ////////////////////////

let selectedDataVertexId = $state<string | null>(null);

export function getSelDataVertexId() {
  return selectedDataVertexId;
}

export function updSelDataVertexId(vertexId: string | null) {
  selectedDataVertexId = vertexId;
}

/////////////////////////////Edges State //////////////////////////////////////////////////////

let edgesState = $state<EdgeType[]>([]);

export function getEdges() {
  return edgesState;
}

export function addEdge(fromId: string, toId: string) {
  const edgeId = `${fromId}-to-${toId}`;
  if (edgesState.some((edge) => edge.edgeId === edgeId)) return;
  //array is replaced, so the reactivity is triggered
  edgesState = [...edgesState, { fromId, toId, edgeId }];
}

export function deleteAllVertexEdges(vertexId: string) {
  edgesState = edgesState.filter((edge) => edge.fromId !== vertexId && edge.toId !== vertexId);
}

//////////////////////////////Vertex Elements Bounding rects State a.k.a their  positions

let verticesRectsMap = $state(new Map<string, VertexRectType>());

export function updVerticesRects(
  vertexId: string,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const newVerticesRectsMap = new Map(verticesRectsMap);
  newVerticesRectsMap.set(vertexId, { vertexId, x, y, width, height });
  //reassigning map to trigger reactivity
  verticesRectsMap = newVerticesRectsMap;
}
///////////////////////////// Edge Anchors state
//derived Svelte5 state - this variables "reacts" on the changes in edgesState and changing postions of vertices elements
let edgeAnchors = $derived.by(() => {
  const edgesPosMap: Record<string, { x1: number; y1: number; x2: number; y2: number }> = {};
  for (const { fromId, toId, edgeId } of edgesState) {
    const vertexFrom = verticesRectsMap.get(fromId);
    const vertexTo = verticesRectsMap.get(toId);
    if (vertexFrom && vertexTo) {
      const x1 = vertexFrom.x + vertexFrom.width / 2;
      const y1 = vertexFrom.y + vertexFrom.height;
      const x2 = vertexTo.x + vertexTo.width / 2;
      const y2 = vertexTo.y;

      edgesPosMap[edgeId] = { x1, x2, y1, y2 };
    }
  }
  return edgesPosMap;
});

export function getEdgesAnchors() {
  return edgeAnchors;
}
