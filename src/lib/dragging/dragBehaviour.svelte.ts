import { detectHover, detectCollision } from './collisionCheck.svelte';
import {
  createClonesOnDrag,
  filterDropDivChildren,
  attachStylesToChildren,
  handleDataVertexDrop
} from './dragUtils';
import { dataVertexStore, edgesSore } from '$lib/store';
import { get } from 'svelte/store';
import { drawEdgeLine, findEdgesOfVertex, updateSvgLines } from '$lib/drawing/svgEdgesDraw.svelte';
import { addDelButton } from './deleteAction.svelte';

import {
  DROP_AREA_DIV_ID,
  DRAG_FROM_DIV_ID,
  DATA_TRANSFER_ID_KEY,
  DRAG_CLONE_ID,
  HIDDEN_IMG_PREVIEW_ID
} from '$lib/config/domConstants';

import {
  BORDER_COLOUR_YES_COLLISION,
  BORDER_COLOUR_NO_COLLISION,
  VERTEX_IN_DROP_WIDTH_STYLE,
  VERTEX_IN_DROP_WIDTH_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS_2XL,
  VERTEX_IN_DROP_PADDING_CLASS
} from '$lib/config/stylesAndClasses';

let curEdgeFrom: HTMLElement | null = $state(null);
let curEdgeTo: HTMLElement | null = $state(null);

export function ondragstartHandler(event: DragEvent) {
  if (event.target instanceof HTMLElement && event.dataTransfer) {
    const curDraggedEl = event.target;
    event.dataTransfer.setData(DATA_TRANSFER_ID_KEY, curDraggedEl.id);
    //event.target.classList.add('draggingTEST');
    createClonesOnDrag(curDraggedEl, event);

    const assotiatedEdges = findEdgesOfVertex(curDraggedEl.id);

    assotiatedEdges.forEach((edge) => {
      const edgeEl = document.getElementById(edge.edgeId);
      if (edgeEl) {
        edgeEl.style.opacity = '0';
      }
    });
    curDraggedEl.style.opacity = '0';
  }
}

export function ondragHandler(event: DragEvent) {
  const curDraggedEl = event.target as HTMLElement;
  const curOnDragClone = document.getElementById(DRAG_CLONE_ID);
  if (!(curDraggedEl instanceof HTMLElement) || !curOnDragClone) return;
  //curDraggedEl.classList.add('draggingTEST');

  const codeEditorDiv = document.getElementById(DROP_AREA_DIV_ID);
  if (!(codeEditorDiv instanceof HTMLElement)) return;

  curOnDragClone.style.visibility = 'visible';
  //curOnDragClone.classList.add(VERTEX_IN_DROP_WIDTH_CLASS, VERTEX_IN_DROP_WIDTH_CLASS_2XL);

  //const codeEditorDivRect = codeEditorDiv.getBoundingClientRect();
  //const offsetX = event.clientX - codeEditorDivRect.left - curOnDragClone.offsetWidth / 2;
  //const offsetY = event.clientY - codeEditorDivRect.top - curOnDragClone.offsetHeight / 2;
  const offsetX = event.clientX - curOnDragClone.offsetWidth / 2;
  const offsetY = event.clientY - curOnDragClone.offsetHeight / 2;

  curOnDragClone.style.left = `${offsetX}px`;
  curOnDragClone.style.top = `${offsetY}px`;

  let vertexElements = filterDropDivChildren(codeEditorDiv.children, curDraggedEl);

  const hoveredNode = detectHover(curOnDragClone, vertexElements);
  if (hoveredNode instanceof HTMLElement) {
    let isAcceptedByHovered: Boolean;
    let isDraggedElCanConnect: Boolean;

    [isAcceptedByHovered, isDraggedElCanConnect] = detectCollision(hoveredNode, curDraggedEl);
    if (isAcceptedByHovered && isDraggedElCanConnect) {
      //curOnDragClone.style.backgroundColor = 'blue';
      attachStylesToChildren(curOnDragClone, 'borderColor', BORDER_COLOUR_YES_COLLISION);
      attachStylesToChildren(hoveredNode, 'borderColor', BORDER_COLOUR_YES_COLLISION);
      curOnDragClone.classList.remove('animate-shake');

      curEdgeFrom = hoveredNode;
      curEdgeTo = curDraggedEl;
    } else {
      attachStylesToChildren(curOnDragClone, 'borderColor', BORDER_COLOUR_NO_COLLISION);
      curOnDragClone.classList.add('animate-shake');
    }
  } else {
    attachStylesToChildren(curOnDragClone, 'borderColor', '');
    curOnDragClone.classList.remove('animate-shake');
  }

  get(edgesSore).forEach((edge) => {
    const fromVertex = document.getElementById(edge.fromId);
    const toVertex = document.getElementById(edge.toId);

    if (fromVertex && toVertex) {
      updateSvgLines(fromVertex);
      updateSvgLines(toVertex);
    }
  });
}
export function ondragendHandler(event: DragEvent) {
  document.getElementById(DRAG_CLONE_ID)?.remove();
  document.getElementById(HIDDEN_IMG_PREVIEW_ID)?.remove();
  const curDraggedEl = event.target as HTMLElement;
  if (curDraggedEl) {
    curDraggedEl.style.opacity = '1';
  }

  curEdgeFrom = null;
  curEdgeTo = null;
  const assotiatedEdges = findEdgesOfVertex(curDraggedEl.id);

  assotiatedEdges.forEach((edge) => {
    const edgeEl = document.getElementById(edge.edgeId);
    if (edgeEl) {
      edgeEl.style.opacity = '1';
    }
  });
}

export function dropHandler(event: DragEvent) {
  event.preventDefault();
  const codeEditorDiv = event.target as HTMLElement;
  if (codeEditorDiv instanceof HTMLElement && event.dataTransfer) {
    const dropAreaRect = codeEditorDiv?.getBoundingClientRect();
    const offsetX = event.clientX - dropAreaRect.left;
    const offsetY = event.clientY - dropAreaRect.top;
    const dragElId = event.dataTransfer.getData(DATA_TRANSFER_ID_KEY);
    const draggedEl = document.getElementById(dragElId);
    if (draggedEl instanceof HTMLElement) {
      handleDataVertexDrop(draggedEl);
      draggedEl.style.position = 'absolute';
      draggedEl.classList.add(
        VERTEX_IN_DROP_WIDTH_CLASS,
        VERTEX_IN_DROP_WIDTH_CLASS_2XL
        //VERTEX_IN_DROP_PADDING_CLASS
      );

      const elWidth = draggedEl.offsetWidth;
      const elHeight = draggedEl.offsetHeight;

      let left = offsetX - elWidth / 2;
      let top = offsetY - elHeight / 2;

      const maxX = dropAreaRect.width - elWidth;
      const maxY = dropAreaRect.height - elHeight;
      draggedEl.style.left = `${Math.max(0, Math.min(left, maxX))}px`;
      draggedEl.style.top = `${Math.max(0, Math.min(top, maxY))}px`;
      draggedEl.style.opacity = '1';
      //updateSvgLines(draggedEl);
      codeEditorDiv.appendChild(draggedEl);

      addDelButton(draggedEl);

      if (curEdgeFrom && curEdgeTo) {
        drawEdgeLine(curEdgeFrom, curEdgeTo);
      }
      //updateSvgLines(draggedEl);
      requestAnimationFrame(() => {
        updateSvgLines(draggedEl);
      });
    }
  }
}
export function dragoverHandler(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}
