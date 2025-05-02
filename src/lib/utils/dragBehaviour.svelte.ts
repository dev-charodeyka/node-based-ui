import { detectHover, detectCollision } from './collisionCheck.svelte';
let curDraggedEl: HTMLElement | null = $state(null);
let curOnDragClone: HTMLElement | null = $state(null);
let codeEditorDiv: HTMLElement | null = $state(null);

const DRAG_CLONE_ID: string = 'curOnDragEl';
const HIDDEN_IMG_PREVIEW_ID: string = 'hiddenDragImg';

export function ondragstartHandler(event: DragEvent) {
  if (event.target instanceof HTMLElement && event.dataTransfer) {
    curDraggedEl = event.target;
    //console.log(curDraggedEl);
    event.dataTransfer.setData('draggedElId', curDraggedEl.id);

    const ondragHideClone = curDraggedEl.cloneNode(true) as HTMLElement;
    ondragHideClone.id = HIDDEN_IMG_PREVIEW_ID;
    ondragHideClone.style.opacity = '0';
    document.body.appendChild(ondragHideClone);

    event.dataTransfer.setDragImage(ondragHideClone, 0, 0);

    curOnDragClone = curDraggedEl.cloneNode(true) as HTMLElement;

    curOnDragClone.id = DRAG_CLONE_ID;
    curOnDragClone.style.cssText = 'pointer-events: none; position: absolute; visibility: hidden;';
    document.body.appendChild(curOnDragClone);

    //curDraggedEl.style.opacity = '0';
  }
}

export function ondragHandler(event: DragEvent) {
  if (!(event.target instanceof HTMLElement) || !curDraggedEl || !curOnDragClone) return;

  codeEditorDiv = document.getElementById(curDraggedEl.dataset.dropAreaId || 'codeEditorDiv');
  if (!(codeEditorDiv instanceof HTMLElement)) return;

  curOnDragClone.style.visibility = 'visible';
  //curOnDragClone.style.background = 'red'
  const onDragCloneRect = curOnDragClone.getBoundingClientRect();

  const offsetX = event.clientX - onDragCloneRect.width / 2;
  const offsetY = event.clientY - onDragCloneRect.height / 2;

  curOnDragClone.style.left = `${offsetX}px`;
  curOnDragClone.style.top = `${offsetY}px`;

  let nodes: HTMLElement[] = [];
  Array.from(codeEditorDiv.children).forEach((childEl) => {
    if (
      childEl instanceof HTMLElement &&
      childEl.id !== DRAG_CLONE_ID &&
      childEl.id !== curOnDragClone?.id &&
      childEl.id !== 'edgesSvgLayer'
    ) {
      nodes.push(childEl);
      childEl.style.backgroundColor = '';
    }
  });
  const hoveredNode = detectHover(curOnDragClone, nodes);
  if (hoveredNode instanceof HTMLElement) {
    let isAcceptedByHovered: Boolean;
    let isDraggedElCanConnect: Boolean;

    [isAcceptedByHovered, isDraggedElCanConnect] = detectCollision(hoveredNode, curDraggedEl);
    if (isAcceptedByHovered && isDraggedElCanConnect) {
      curOnDragClone.style.backgroundColor = 'blue';
    }
  }
}
export function ondragendHandler(event: DragEvent) {
  document.getElementById(DRAG_CLONE_ID)?.remove();
  document.getElementById(HIDDEN_IMG_PREVIEW_ID)?.remove();
  if (curDraggedEl instanceof HTMLElement) {
    curDraggedEl.style.opacity = '1';
  }
}

export function dropHandler(event: DragEvent) {
  event.preventDefault();
  //const dropAreaTarget = event.target as HTMLElement;
  if (
    codeEditorDiv instanceof HTMLElement &&
    codeEditorDiv === event.target &&
    event.dataTransfer
  ) {
    const dropAreaReact = codeEditorDiv?.getBoundingClientRect();
    const offsetX = event.clientX - dropAreaReact.left;
    const offsetY = event.clientY - dropAreaReact.top;
    const dragElId = event.dataTransfer.getData('draggedElId')
    const dragedEl = document.getElementById('dragElId')
    if (dragedEl instanceof HTMLElement){
        dragedEl.style.position = 'absolute'
        
    }
  }
}
export function dragoverHandler(event: DragEvent) {
  event.preventDefault();
}
