import vertices from '$lib/alg/vertices';

const vertexByIdMap = new Map<string, VertexType>(vertices.map((vertex) => [vertex.id, vertex]));

export function detectHover(
  curDragVertexId: string,
  curDragClone: HTMLElement,
  verticesInCodeEditor: HTMLElement[]
): HTMLElement | null {
  const curDragCloneRect = curDragClone.getBoundingClientRect();
  for (let vertexEl of verticesInCodeEditor) {
    if (vertexEl.id === curDragVertexId) continue;
    if (window.getComputedStyle(vertexEl).position === 'relative') continue;
    const vertexElRect = vertexEl.getBoundingClientRect();
    const areIntersecting =
      curDragCloneRect.left < vertexElRect.right &&
      curDragCloneRect.right > vertexElRect.left &&
      curDragCloneRect.top < vertexElRect.bottom &&
      curDragCloneRect.bottom > vertexElRect.top;

    if (areIntersecting) {
      return vertexEl as HTMLElement;
    }
  }
  return null;
}

export function detectCollision(
  hoveredVertexElID: string,
  curDragVertexElId: string
): { isAcceptedByHovered: boolean; isDraggedVertexCanConnect: boolean } {
  const hoveredEl = vertexByIdMap.get(hoveredVertexElID);
  const draggedEl = vertexByIdMap.get(curDragVertexElId);
  if (!hoveredEl || !draggedEl)
    return { isAcceptedByHovered: false, isDraggedVertexCanConnect: false };
  return {
    isAcceptedByHovered: hoveredEl.accepts.includes(curDragVertexElId),
    isDraggedVertexCanConnect: draggedEl.connectsTo.includes(hoveredVertexElID)
  };
}
