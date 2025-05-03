import { edgesSore } from '$lib/store';
import { get } from 'svelte/store';
import { EDGES_SVG_LAYER_ID } from '$lib/config/domConstants';
import { EDGE_LINES_COLOR } from '$lib/config/stylesAndClasses';

export function drawEdgeLine(fromEl: HTMLElement, toEL: HTMLElement) {
  const svgLayer = document.getElementById(EDGES_SVG_LAYER_ID);
  const newEdgeId = `${fromEl.id}-to-${toEL.id}`;
  if (!(svgLayer instanceof SVGSVGElement) || document.getElementById(newEdgeId)) return;

  const svgLayerRect = svgLayer.getBoundingClientRect();
  const fromElRect = fromEl.getBoundingClientRect();
  const toElRect = toEL.getBoundingClientRect();

  const fromX = fromElRect.left + fromElRect.width / 2 - svgLayerRect.left;
  const fromY = fromElRect.top + fromElRect.height - svgLayerRect.top;
  const toX = toElRect.left + toElRect.width / 2 - svgLayerRect.left;
  const toY = toElRect.top - svgLayerRect.top;

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
