import { edgesSore } from '$lib/store';
import { get } from 'svelte/store';
import { EDGES_SVG_LAYER_ID } from '$lib/config/domConstants';
import { EDGE_LINES_COLOR } from '$lib/config/stylesAndClasses';

function calcEdgeXY(fromElRect: DOMRect, toElRect: DOMRect, svgLayerRect: DOMRect) {
  return [
    fromElRect.left + fromElRect.width / 2 - svgLayerRect.left,
    fromElRect.top + fromElRect.height - svgLayerRect.top,
    toElRect.left + toElRect.width / 2 - svgLayerRect.left,
    toElRect.top - svgLayerRect.top
  ];
}

export function drawEdgeLine(fromEl: HTMLElement, toEL: HTMLElement) {
  const svgLayer = document.getElementById(EDGES_SVG_LAYER_ID);
  const newEdgeId = `${fromEl.id}-to-${toEL.id}`;
  if (!(svgLayer instanceof SVGSVGElement) || document.getElementById(newEdgeId)) return;

  const svgLayerRect = svgLayer.getBoundingClientRect();
  const fromElRect = fromEl.getBoundingClientRect();
  const toElRect = toEL.getBoundingClientRect();

  const [fromX, fromY, toX, toY] = calcEdgeXY(fromElRect, toElRect, svgLayerRect);

  const deltaX = (toX - fromX) / 2;
  const d = `M${fromX},${fromY} C${fromX + deltaX},${fromY} ${toX - deltaX},${toY} ${toX},${toY}`;
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  path.setAttribute('id', newEdgeId);
  path.setAttribute('stroke', EDGE_LINES_COLOR);
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('d', d);

  svgLayer.appendChild(path);
  if (!get(edgesSore).find((edge) => edge.edgeId === newEdgeId)) {
    edgesSore.update((edges) => [
      ...edges,
      {
        fromId: fromEl.id,
        toId: toEL.id,
        edgeId: newEdgeId
      }
    ]);
  }
}

export function findEdgesOfVertex(draggedElId: string) {
  return get(edgesSore).filter((edge) => edge.fromId === draggedElId || edge.toId === draggedElId);
}

export function updateSvgLines(movedVertex: HTMLElement) {
  const svgLayer = document.getElementById(EDGES_SVG_LAYER_ID);

  if (!svgLayer) return;
  movedVertex.getBoundingClientRect();
  const svgLayerRect = svgLayer.getBoundingClientRect();

  //const assotiatedEdges = findEdgesOfVertex(movedVertex.id);

  //assotiatedEdges.forEach((edge) => {
  get(edgesSore).forEach((edge) => {
    const edgePath = document.getElementById(edge.edgeId);
    if (!(edgePath instanceof SVGPathElement)) return;
    const fromVertex = document.getElementById(edge.fromId);
    const toVertex = document.getElementById(edge.toId);
    if (fromVertex && toVertex) {
      const fromVertexRect = fromVertex.getBoundingClientRect();
      const toVertexRect = toVertex.getBoundingClientRect();

      const [fromX, fromY, toX, toY] = calcEdgeXY(fromVertexRect, toVertexRect, svgLayerRect);
      const deltaX = (toX - fromX) / 2;
      const d = `M${fromX},${fromY} C${fromX + deltaX},${fromY} ${toX - deltaX},${toY} ${toX},${toY}`;
      edgePath.setAttribute('d', d);
    }
  });
}
