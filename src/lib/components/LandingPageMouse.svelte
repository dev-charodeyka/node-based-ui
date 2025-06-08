<script lang="ts">
  import { tick } from 'svelte';
  import { getVerticesInCodeEditor } from '$lib/state.svelte';
  import EdgesSvgLayer from './EdgesSvgLayer.svelte';
  import CatAngry from '$lib/icons/catAngry.svelte';
  import CatNotAngry from '$lib/icons/catNotAngry.svelte';
  import Broom from '$lib/icons/broom.svelte';
  import { expressAnger } from '$lib/utils/expressAnger';
  import { handleClearCodeEditor } from '$lib/utils/delAddActions.svelte';
  import {
    DROP_AREA_FLDST_ID,
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

  let catIsAngry: boolean = $state(false);
  let catAnnoyedCount: number = 0;
  let catIgnores: boolean = $state(false);

  function onMouseEnter() {
    if (catIgnores) return;
    if (!catIsAngry) {
      catAnnoyedCount++;

      if (catAnnoyedCount === 3) {
        expressAnger();
        catAnnoyedCount = 0;
        catIsAngry = false;
        catIgnores = true;
        setTimeout(() => {
          catIgnores = false;
        }, 7_000);
      }
    }

    catIsAngry = true;
  }

  function onMouseLeave() {
    catIsAngry = false;
  }

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
  <div class="text-aUra-yellow flex h-[4%] w-full items-center justify-center text-lg font-medium">
    Principal Component Analisys: Do It Yourself
  </div>
  <!-- <div class="flex h-[46%] w-full items-center justify-center gap-x-2"> -->
  <div class="flex h-[95%] w-full items-center justify-center gap-x-2">
    <fieldset class="relative h-full w-[55%] px-1 pb-2" id={DROP_AREA_FLDST_ID}>
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
      <button
        onmouseenter={onMouseEnter}
        onmouseleave={onMouseLeave}
        onclick={expressAnger}
        class="h-10 w-10"
      >
        {#if catIsAngry}
          <span class="absolute -top-12 left-[30%] h-10 w-10 xl:left-[20%]">
            <CatAngry />
          </span>
        {:else}
          <span class="-top-8.5 absolute left-[30%] h-7 w-7 xl:left-[20%]">
            <CatNotAngry />
          </span>
        {/if}
      </button>
      <button
        onclick={handleClearCodeEditor}
        class="border-aura-yellow text-aura-red bg-dark-purple hover:bg-aura-yellow absolute right-2 top-0 h-8 w-8 cursor-pointer rounded-full border-2 p-1"
      >
        <Broom />
      </button>
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
