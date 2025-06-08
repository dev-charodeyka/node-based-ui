import {
  addVertexToCodeEditor,
  getSelDataVertexId,
  updSelDataVertexId,
  deleteVertexFromCodeEditor,
  deleteAllVertexEdges
} from '$lib/state.svelte';
import { VERTEX_EL_CLASS } from '$lib/config/domConstants';

export function handleAddVertex(event: MouseEvent) {
  const clickTargetEl = event.currentTarget;
  if (!(clickTargetEl instanceof HTMLElement)) return;

  const vertexEl = clickTargetEl.closest(`.${VERTEX_EL_CLASS}`);
  if (!(vertexEl instanceof HTMLElement)) return;

  if (vertexEl.dataset.vertexType === 'data' && getSelDataVertexId() !== vertexEl.id) {
    updSelDataVertexId(vertexEl.id);
  }
  addVertexToCodeEditor(vertexEl.id);
}

export function handleDelVertex(event: MouseEvent) {
  const clickTargetEl = event.currentTarget;
  if (!(clickTargetEl instanceof HTMLElement)) return;

  const vertexEl = clickTargetEl.closest(`.${VERTEX_EL_CLASS}`);
  if (!(vertexEl instanceof HTMLElement)) return;
  if (vertexEl.dataset.vertexType === 'data' && getSelDataVertexId() === vertexEl.id) {
    updSelDataVertexId(null);
  }
  deleteVertexFromCodeEditor(vertexEl.id);
  deleteAllVertexEdges(vertexEl.id);
}

export function handleClearCodeEditor() {
  if (getSelDataVertexId() !== null) {
    updSelDataVertexId(null);
  }

  const allVertices = Array.from(document.querySelectorAll<HTMLElement>(`.${VERTEX_EL_CLASS}`));

  allVertices.forEach((vertexEl) => {
    deleteAllVertexEdges(vertexEl.id);
    deleteVertexFromCodeEditor(vertexEl.id);
  });
}
