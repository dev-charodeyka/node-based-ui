import { VERTEX_EL_CLASS, DRAG_CLONE_ID, DROP_AREA_DIV_ID } from '$lib/config/domConstants';
import {
  VERTEX_IN_DROP_WIDTH_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS_2XL
} from '$lib/config/stylesAndClasses';
import { detectCollision, detectHover } from '$lib/drawing/detectCollsion.svelte';

import { addEdge, getVerticesInCodeEditor, updVerticesRects } from '$lib/state.svelte';
import { toggleCollistionStyles, getNonButtonChildren, clearCollisionStyles } from './dragUtils';
let curDragVertex: HTMLElement | null = null;
let curDragClone: HTMLElement | null = null;

let codeEditorDiv: HTMLElement | null = null;
let codeEditorDivRect: DOMRect | null = null;

let dragOffset = { x: 0, y: 0 };

//throttling function that is used for dragover events to lower cpu consumption(dragover is fired quite a lot on screens with high resolution)
//Raf throttling is based on requestAnimationFrame to limit the rate at which a dragover is called,
// to ensure that the function is invoked at most once per animation frame

const rafThrottle = (callback: (event: DragEvent) => void) => {
  // tracks if a frame is already scheduled
  // ID from requestAnimationFrame
  let requestId: number | null = null;
  // storing latest arguments of the funbction to throttle
  let lastArgs: [DragEvent];

  const later = (context: any) => () => {
    //console.log('THROTTLE CONTEXT', context);
    // clear scheduled frame
    requestId = null;
    // call the original ondragover function
    callback.apply(context, lastArgs);
  };

  const throttled = function (this: any, ...args: [DragEvent]) {
    const e = args[0];
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    // updating to the latest arguments
    lastArgs = args;
    if (requestId === null) {
      // schedule for next animation frame
      requestId = requestAnimationFrame(later(this));
    }
  };
  //cancelling = cleanup to abort a pending update (on ondragend)
  throttled.cancel = () => {
    if (requestId !== null) {
      cancelAnimationFrame(requestId);
      requestId = null;
    }
  };

  return throttled;
};

export function ondragstartHandler(event: DragEvent) {
  if (!(event.target instanceof HTMLElement) || !event.dataTransfer) return;
  curDragVertex = event.target.closest(`.${VERTEX_EL_CLASS}`) as HTMLElement;
  if (!curDragVertex) return;
  //placeholder, some browser require it to start firing drag events
  event.dataTransfer.setData('text/plain', '');
  event.dataTransfer.effectAllowed = 'move';
  //setting up an image preview that will be visualized for ondragover events

  curDragClone = curDragVertex.cloneNode(true) as HTMLElement;
  curDragClone.id = DRAG_CLONE_ID;

  Object.assign(curDragClone.style, {
    position: 'absolute',
    pointerEvents: 'none',
    visibility: 'hidden',
    //opacity: '0',
    zIndex: '9999'
  });
  curDragClone.classList.add(VERTEX_IN_DROP_WIDTH_CLASS, VERTEX_IN_DROP_WIDTH_CLASS_2XL);
  document.body.appendChild(curDragClone);
  const curDragVertexRect = curDragVertex.getBoundingClientRect();
  dragOffset.x = event.clientX - curDragVertexRect.left;
  dragOffset.y = event.clientY - curDragVertexRect.top;
  event.dataTransfer.setDragImage(curDragClone, dragOffset.x, dragOffset.y);
  curDragVertex.style.opacity = '0';
}

function dragoverHandler(event: DragEvent) {
  event.preventDefault();
  if (!curDragClone || !curDragVertex) return;
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';

  const clonePosX = event.clientX - dragOffset.x;
  const clonePosY = event.clientY - dragOffset.y;

  curDragClone.style.left = `${clonePosX}px`;
  curDragClone.style.top = `${clonePosY}px`;
  curDragClone.style.visibility = 'visible';
  //curDragClone.style.opacity = '1';

  codeEditorDiv = document.getElementById(DROP_AREA_DIV_ID);
  if (!(codeEditorDiv instanceof HTMLElement)) return;
  codeEditorDivRect = codeEditorDiv.getBoundingClientRect();

  const dragVertexPosX = clonePosX - codeEditorDivRect.left;
  const dragVertexPosY = clonePosY - codeEditorDivRect.top;

  curDragVertex.style.position = 'absolute';
  curDragVertex.style.left = `${dragVertexPosX}px`;
  curDragVertex.style.top = `${dragVertexPosY}px`;
  curDragVertex.style.pointerEvents = 'none';

  updVerticesRects(
    curDragVertex.id,
    dragVertexPosX,
    dragVertexPosY,
    curDragClone.offsetWidth,
    curDragClone.offsetHeight
  );

  let verticesCodeEditor = getVerticesInCodeEditor(true)
    .map(({ vertex }) => document.getElementById(vertex.id))
    .filter((vertexEl) => vertexEl !== null);

  verticesCodeEditor.forEach((vertexEl) => {
    clearCollisionStyles(getNonButtonChildren(vertexEl));
  });
  const curDragCloneChildren = getNonButtonChildren(curDragClone);
  // lutshe perebded', chem nedobded'
  clearCollisionStyles(curDragCloneChildren);

  const hoveredVertex = detectHover(curDragVertex.id, curDragClone, verticesCodeEditor);
  if (!(hoveredVertex instanceof HTMLElement)) return;
  const hoveredVertexChildren = getNonButtonChildren(hoveredVertex);
  const { isAcceptedByHovered, isDraggedVertexCanConnect } = detectCollision(
    hoveredVertex.id,
    curDragVertex.id
  );

  const areCollided = isAcceptedByHovered && isDraggedVertexCanConnect;
  toggleCollistionStyles(hoveredVertexChildren, 'collided', areCollided);
  toggleCollistionStyles(hoveredVertexChildren, 'non-collided', !areCollided);

  toggleCollistionStyles(curDragCloneChildren, 'collided', areCollided);
  toggleCollistionStyles(curDragCloneChildren, 'non-collided', !areCollided);
  toggleCollistionStyles(curDragCloneChildren, 'animate-shake', !areCollided);

  if (areCollided) {
    addEdge(hoveredVertex.id, curDragVertex.id);
  }
}

export const throttledDragover = rafThrottle(dragoverHandler);

export function ondragendHandler() {
  document.getElementById(DRAG_CLONE_ID)?.remove();
  curDragClone = null;
  if (curDragVertex) {
    curDragVertex.style.opacity = '1';
    curDragVertex.style.pointerEvents = '';
  }
  curDragVertex = null;
}

export function dropHandler(event: DragEvent) {
  event.preventDefault();

  if (!codeEditorDiv || !curDragVertex || !codeEditorDivRect) return;

  const offsetX = event.clientX - codeEditorDivRect.left;
  const offsetY = event.clientY - codeEditorDivRect.top;

  curDragVertex.style.position = 'absolute';

  const curDragVertexWidth = curDragVertex.offsetWidth;
  const curDragVertexHeight = curDragVertex.offsetHeight;
  let left = offsetX - curDragVertexWidth / 2;
  let top = offsetY - curDragVertexHeight / 2;

  left = Math.max(0, Math.min(left, codeEditorDivRect.width - curDragVertexWidth));
  top = Math.max(0, Math.min(top, codeEditorDivRect.height - curDragVertexHeight));

  curDragVertex.style.left = `${left}px`;
  curDragVertex.style.top = `${top}px`;

  updVerticesRects(
    curDragVertex.id,
    left,
    top,
    curDragVertex.offsetWidth,
    curDragVertex.offsetHeight
  );
}
