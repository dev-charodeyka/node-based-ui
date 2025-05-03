import {
  DELETE_VERTEX_BTN_CLASS,
  DRAG_FROM_DIV_ID,
  VERTEX_EL_CLASS
} from '$lib/config/domConstants';
import {
  VERTEX_IN_DROP_PADDING_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS_2XL
} from '$lib/config/stylesAndClasses';
import { trashBinIconSvg } from '$lib/icons/trashBin';
import { dataVertexStore, edgesSore } from '$lib/store';
import { enableAllDataVertices } from './dragUtils';
import { drawEdgeLine, findEdgesOfVertex, updateSvgLines } from '$lib/drawing/svgEdgesDraw.svelte';

export function addDelButton(vertexEl: HTMLElement) {
  if (vertexEl.querySelector(`.${DELETE_VERTEX_BTN_CLASS}`)) return;

  const delButton = document.createElement('button');
  delButton.className = DELETE_VERTEX_BTN_CLASS;
  delButton.addEventListener('click', (event: MouseEvent) => delVertex(event));
  delButton.innerHTML = trashBinIconSvg;
  vertexEl.appendChild(delButton);
}

export function delVertex(event: MouseEvent) {
  const clickTraget = event.target as HTMLElement;
  const moveToEl = document.getElementById(DRAG_FROM_DIV_ID);
  if (!clickTraget || !moveToEl) return;
  const vertexToMove = clickTraget.closest(`.${VERTEX_EL_CLASS}`) as HTMLElement;
  const delButton = clickTraget.closest(`.${DELETE_VERTEX_BTN_CLASS}`) as HTMLElement;
  if (vertexToMove && delButton) {
    delButton.remove();
    animateAndMoveVertex(vertexToMove, moveToEl);
  }
}

function animateAndMoveVertex(vertexEl: HTMLElement, moveToEl: HTMLElement) {
  const curVertexRect = vertexEl.getBoundingClientRect();
  vertexEl.querySelector(`.${DELETE_VERTEX_BTN_CLASS}`)?.remove();
  vertexEl.style.position = '';
  vertexEl.style.top = '';
  vertexEl.style.bottom = '';
  vertexEl.style.left = '';
  vertexEl.style.right = '';
  vertexEl.classList.remove(
    VERTEX_IN_DROP_PADDING_CLASS,
    VERTEX_IN_DROP_WIDTH_CLASS
    //VERTEX_IN_DROP_WIDTH_CLASS_2XL
  );

  if (vertexEl.dataset.vertexType === 'data') {
    dataVertexStore.set(false);
    enableAllDataVertices();
  }

  moveToEl.appendChild(vertexEl);
  const newVertexRect = vertexEl.getBoundingClientRect();
  const deltaX = curVertexRect.left - newVertexRect.left;
  const deltaY = curVertexRect.top - newVertexRect.top;

  vertexEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  vertexEl.getBoundingClientRect(); //force reflow
  vertexEl.style.transition = 'transform 300ms ease';
  vertexEl.style.transform = 'translate(0, 0)';
  vertexEl.addEventListener(
    'transitioned',
    () => {
      vertexEl.style.transition = '';
      vertexEl.style.transform = '';
    },
    { once: true }
  );

  const assotiatedEdges = findEdgesOfVertex(vertexEl.id);
  assotiatedEdges.forEach((edge) => {
    const edgeEl = document.getElementById(edge.edgeId);
    if (edgeEl) {
      edgeEl.remove();
    }
  });

  edgesSore.update((edges) => {
    const assocEdgeIds = new Set(assotiatedEdges.map((e) => e.edgeId));
    return edges.filter((edge) => !assocEdgeIds.has(edge.edgeId));
  });
}
