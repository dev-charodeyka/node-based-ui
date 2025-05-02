import vertices from '$lib/alg/vertices';

export function detectHover(dragEl: HTMLElement, nodes: HTMLElement[]): HTMLElement | null {
  for (let node of nodes) {
    const nodeRect = node.getBoundingClientRect();
    const dragElRect = dragEl.getBoundingClientRect();

    const areIntersecting: Boolean =
      dragElRect.left < nodeRect.right &&
      dragElRect.right > nodeRect.left &&
      dragElRect.top < nodeRect.bottom &&
      dragElRect.bottom > nodeRect.top;

    if (areIntersecting) {
      return node as HTMLElement;
    }
  }
  return null;
}

export function detectCollision(hoveredNode: HTMLElement, dragEl: HTMLElement): [Boolean, Boolean] {
  const hoveredNodeRules = vertices.find((vertex) => vertex.id == hoveredNode.id);
  const dragElRules = vertices.find((vertex) => vertex.id === dragEl.id);

  if (hoveredNodeRules && dragElRules) {
    return [
      dragElRules.connectsTo.includes(hoveredNode.id),
      hoveredNodeRules.accepts.includes(dragEl.id)
    ];
  }

  return [false, false];
}
