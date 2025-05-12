import { VERTEX_EL_CLASS, DRAG_CLONE_ID } from '$lib/config/domConstants';
import {
  VERTEX_IN_DROP_WIDTH_CLASS,
  VERTEX_IN_DROP_WIDTH_CLASS_2XL
} from '$lib/config/stylesAndClasses';
let curDragVertex: HTMLElement | null = null;
let curDragClone: HTMLElement | null = null;

let curVertexEdgeFrom: HTMLElement | null = null;
let curVertexEdgeTo: HTMLElement | null = null;

export function ondragstartHandler(event: DragEvent) {
  if (!(event.target instanceof HTMLElement) || !event.dataTransfer) return;
  curDragVertex = event.target.closest(`.${VERTEX_EL_CLASS}`) as HTMLElement;
  if (!curDragVertex) return;
  //placeholder, some browser require it to start firing drag events
  event.dataTransfer.setData('text/plain', '');

  //setting up an image preview that will be visualized for ondragover events

  curDragClone = curDragVertex.cloneNode(true) as HTMLElement;
  curDragClone.id = DRAG_CLONE_ID;

  Object.assign(curDragClone.style, {
    position: 'absolute',
    PointerEvents: 'none',
    visibility: 'hidden'
  });
  curDragClone.classList.add(VERTEX_IN_DROP_WIDTH_CLASS, VERTEX_IN_DROP_WIDTH_CLASS_2XL);
}
