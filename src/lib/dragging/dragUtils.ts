export function getNonButtonChildren(el: HTMLElement): HTMLElement[] {
  return Array.from(el.children).filter(
    (childEl): childEl is HTMLElement => childEl.tagName !== 'BUTTON'
  );
}

export function toggleCollistionStyles(
  elems: HTMLElement[],
  className: string,
  addRemove: boolean
) {
  elems.forEach((element) => element.classList.toggle(className, addRemove));
}

export function clearCollisionStyles(elems: HTMLElement[]) {
  for (const twclass of ['collided', 'non-collided', 'animate-shake']) {
    toggleCollistionStyles(elems, twclass, false);
  }
}
