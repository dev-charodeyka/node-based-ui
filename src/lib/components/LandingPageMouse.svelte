<script lang="ts">
  import { tick } from 'svelte';
  import { getVerticesInCodeEditor } from '$lib/state.svelte';
  import EdgesSvgLayer from './EdgesSvgLayer.svelte';
  import {
    DROP_AREA_DIV_ID,
    VERTICES_ORIGIN_DIV_ID,
    VERTEX_EL_CLASS
  } from '$lib/config/domConstants';

  import {
    ondragendHandler,
    ondragstartHandler,
    //dragoverHandler,
    throttledDragover,
    dropHandler
  } from '$lib/dragging/dragBehaviour.svelte';
  import Vertex from './Vertex.svelte';
  import PseudoCode from './PseudoCode.svelte';
  const verticesBoundingRects = new Map<string, DOMRect>();

  function captureAllVertexRects() {
    verticesBoundingRects.clear();
    document.querySelectorAll(`.${VERTEX_EL_CLASS}`).forEach((vertexEl) => {
      verticesBoundingRects.set(vertexEl.id, vertexEl.getBoundingClientRect());
    });
  }

  function animateMovingVertexEls() {
    const vertexEls: NodeListOf<HTMLElement> = document.querySelectorAll(`.${VERTEX_EL_CLASS}`);
    for (const vertexEl of vertexEls) {
      const previousRect = verticesBoundingRects.get(vertexEl.id);
      if (!(vertexEl instanceof HTMLElement) || !previousRect) continue;

      const { left: newX, top: newY } = vertexEl.getBoundingClientRect();
      const deltaX = previousRect.left - newX;
      const deltaY = previousRect.top - newY;
      if (!deltaX && !deltaY) continue;
      vertexEl.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      vertexEl.getBoundingClientRect();
      vertexEl.style.transition = 'transform 300ms ease';
      vertexEl.style.transform = '';
      vertexEl.addEventListener(
        'transitioned',
        () => {
          vertexEl.style.transition = '';
        },
        { once: true }
      );
    }
    verticesBoundingRects.clear();
  }
  //before update:
  $effect.pre(() => {
    captureAllVertexRects();
    getVerticesInCodeEditor(true);
    getVerticesInCodeEditor(false);
  });
  //after update:
  $effect(() => {
    tick().then(() => {
      animateMovingVertexEls();
    });
    getVerticesInCodeEditor(true);
    getVerticesInCodeEditor(false);
  });
</script>

<!-- <main class="flex h-[200vh] w-full flex-col items-center justify-center gap-y-2 p-2"> -->
<main class="flex h-screen w-full flex-col items-center justify-center gap-y-2 p-2">
  <!-- <div class="text-aUra-yellow flex h-[2%] w-full items-center justify-center text-xl font-bold"> -->
  <div class="text-aUra-yellow flex h-[5%] w-full items-center justify-center text-xl font-bold">
    Principal Component Analisys: Do It Yourself
  </div>
  <!-- <div class="flex h-[46%] w-full items-center justify-center gap-x-2"> -->
  <div class="flex h-[94%] w-full items-center justify-center gap-x-2">
    <fieldset class="h-full w-[55%] px-1 pb-2">
      <legend> Code Editor</legend>
      <div
        class="flex-reverse relative flex h-full w-full items-end -space-x-48 rounded-md p-2"
        id={DROP_AREA_DIV_ID}
        ondragend={ondragendHandler}
        ondrop={dropHandler}
        ondragover={throttledDragover}
        ondragstart={ondragstartHandler}
        aria-label="Droppable Area"
        role="region"
      >
        <EdgesSvgLayer />
        {#each getVerticesInCodeEditor(true) as { vertex, isVertexIn } (vertex.id)}
          <Vertex {vertex} {isVertexIn} />
        {/each}
      </div>
    </fieldset>
    <div class="flex h-full w-[45%] flex-col items-center justify-center gap-y-1">
      <fieldset class="h-[50%] w-full px-2 pb-2 pt-1">
        <legend>Operations</legend>
        <div
          class="grid h-full w-full grid-cols-3 gap-4"
          aria-label="Area w/ draggable elements"
          role="region"
          ondragstart={ondragstartHandler}
          ondragend={ondragendHandler}
          id={VERTICES_ORIGIN_DIV_ID}
        >
          {#each getVerticesInCodeEditor(false) as { vertex, isVertexIn } (vertex.id)}
            <Vertex {vertex} {isVertexIn} />
          {/each}
        </div>
      </fieldset>
      <fieldset class="h-[50%] w-full">
        <legend> Pseudo Code</legend>
        <PseudoCode />
      </fieldset>
    </div>
  </div>
  <!-- <fieldset class="h-[52%] w-full"><legend> Output</legend></fieldset> -->
</main>
