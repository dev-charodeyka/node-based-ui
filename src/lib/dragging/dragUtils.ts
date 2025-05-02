import {
  HIDDEN_IMG_PREVIEW_ID,
  DRAG_CLONE_ID,
  EDGES_SVG_LAYER_ID,
  DROP_AREA_CLEANER_BUTTON_ID
} from '$lib/config/domConstants';
import {
  VERTEX_IN_DROP_WIDTH_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS_2XL
} from '$lib/config/stylesAndClasses';
import { dataVertexStore, edgesSore } from '$lib/store';
import { get } from 'svelte/store';

export function createClonesOnDrag(curDraggedEl: HTMLElement, event: DragEvent) {
  const ondragHiddenClone = curDraggedEl.cloneNode(true) as HTMLElement;
  ondragHiddenClone.id = HIDDEN_IMG_PREVIEW_ID;
  ondragHiddenClone.style.opacity = '0';

  /* ondragHiddenClone.style.position = 'absolute';
  ondragHiddenClone.style.top = '-9999px';
  ondragHiddenClone.style.left = '-9999px';
  ondragHiddenClone.style.width = `${curDraggedEl.offsetWidth}px`;
  ondragHiddenClone.style.height = `${curDraggedEl.offsetHeight}px`;
  const rect = curDraggedEl.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top */
  document.body.appendChild(ondragHiddenClone);
  event.dataTransfer?.setDragImage(ondragHiddenClone, 0, 0); //offsetX, offsetY);

  const curOnDragClone = curDraggedEl.cloneNode(true) as HTMLElement;
  curOnDragClone.id = DRAG_CLONE_ID;
  curOnDragClone.style.cssText = `pointer-events: none; position: absolute; visibility: hidden;`;
  curOnDragClone.classList.add(VERTEX_IN_DROP_WIDTH_CLASS, VERTEX_IN_DROP_WIDTH_CLASS_2XL);
  document.body.appendChild(curOnDragClone);
}

export function filterDropDivChildren(
  codeEditorChildren: HTMLCollection,
  curDraggedEl?: HTMLElement
): HTMLElement[] {
  let vertexElements: HTMLElement[] = [];
  Array.from(codeEditorChildren).forEach((childEl) => {
    if (
      childEl instanceof HTMLElement &&
      childEl.id !== DRAG_CLONE_ID &&
      childEl.id !== curDraggedEl?.id &&
      childEl.id !== EDGES_SVG_LAYER_ID &&
      childEl.id !== DROP_AREA_CLEANER_BUTTON_ID
    ) {
      vertexElements.push(childEl);
      attachStylesToChildren(childEl, 'borderColor', '');
    }
  });
  return vertexElements;
}

export function attachStylesToChildren<CSSKey extends keyof CSSStyleDeclaration>(
  el: HTMLElement,
  styleName: CSSKey,
  styleValue: CSSStyleDeclaration[CSSKey]
) {
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      child.style[styleName] = styleValue;
    }
  });
}

export function handleDataVertexDrop(draggedEl: HTMLElement) {
  const isDataVertex = draggedEl.dataset.vertexType === 'data';
  const isAlreadyInDropArea = draggedEl.dataset.insideDropArea === 'true';
  if (isDataVertex && get(dataVertexStore) && !isAlreadyInDropArea) {
    return;
  }
  if (isDataVertex && !isAlreadyInDropArea) {
    dataVertexStore.set(true);
    draggedEl.dataset.insideDropArea = 'true';
    disableOtherDataVertices(draggedEl.id);
  }
}

function disableOtherDataVertices(addedDataElId: string) {
  const allDataVertices = document.querySelectorAll<HTMLElement>('[data-vertex-type="data"]');
  allDataVertices.forEach((vertex) => {
    if (vertex.id !== addedDataElId) {
      vertex.setAttribute('draggable', 'false');
      reattachClassesToChildren(vertex, 'disabled-drag', 'add');
    }
  });
}

function reattachClassesToChildren(el: HTMLElement, className: string, action: 'add' | 'remove') {
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      if (action === 'add') {
        child.classList.add(className);
      } else if (action === 'remove') {
        child.classList.remove(className);
      }
    }
  });
}
