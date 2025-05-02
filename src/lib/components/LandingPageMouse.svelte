<script lang="ts">
  import {
    ondragHandler,
    ondragendHandler,
    ondragstartHandler,
    dragoverHandler,
    dropHandler
  } from '$lib/dragging/dragBehaviour.svelte';
  import vertices from '$lib/alg/vertices';
  import Vertex from './Vertex.svelte';
  import { DROP_AREA_DIV_ID, DRAG_FROM_DIV_ID } from '$lib/config/domConstants';
</script>

<main class="flex h-[200vh] w-full flex-col items-center justify-center gap-y-2 p-2">
  <div class="text-aUra-yellow flex h-[2%] w-full items-center justify-center text-xl font-bold">
    Principal Component Analisys: Do It Yourself
  </div>
  <div class="flex h-[46%] w-full items-center justify-center gap-x-2">
    <fieldset class="h-full w-[55%] px-1 pb-2">
      <legend> Code Editor</legend>
      <div
        class="relative h-full w-full rounded-md"
        id={DROP_AREA_DIV_ID}
        ondrag={ondragHandler}
        ondragend={ondragendHandler}
        ondrop={dropHandler}
        ondragover={dragoverHandler}
        ondragstart={ondragstartHandler}
        aria-label="Droppable Area"
        role="region"
      ></div>
    </fieldset>
    <div class="flex h-full w-[45%] flex-col items-center justify-center gap-y-1">
      <fieldset class="h-[50%] w-full px-2 pb-2 pt-1">
        <legend>Operations</legend>
        <div
          class="grid h-full w-full grid-cols-3 gap-4"
          aria-label="Area w/ draggable elements"
          role="region"
          ondrag={ondragHandler}
          ondragstart={ondragstartHandler}
          ondragend={ondragendHandler}
          id={DRAG_FROM_DIV_ID}
        >
          {#each vertices as vertex}
            <Vertex {vertex} />{/each}
        </div>
      </fieldset>
      <fieldset class="h-[50%] w-full">
        <legend> Pseudo Code</legend>
      </fieldset>
    </div>
  </div>
  <fieldset class="h-[52%] w-full"><legend> Output</legend></fieldset>
</main>
