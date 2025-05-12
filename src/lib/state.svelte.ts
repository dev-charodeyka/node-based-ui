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
