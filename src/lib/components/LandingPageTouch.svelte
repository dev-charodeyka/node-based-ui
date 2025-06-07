<script lang="ts">
  import CatNotAngry from '$lib/icons/catNotAngry.svelte';
  import CatAngry from '$lib/icons/catAngry.svelte';
  import { DROP_AREA_FLDST_ID } from '$lib/config/domConstants';
  import { expressAnger } from '$lib/utils/expressAnger';
  let catIsAngry: boolean = $state(false);
  let catAnnoyedCount: number = 0;
  let catIgnores: boolean = $state(false);
  function onTouch(event: TouchEvent) {
    //event.preventDefault();

    if (catIgnores) return;

    catAnnoyedCount++;
    if (catAnnoyedCount === 3) {
      expressAnger();
      catAnnoyedCount = 0;
      catIsAngry = false;
      catIgnores = true;
      setTimeout(() => (catIgnores = false), 7_000);
    }

    catIsAngry = !catIsAngry;
    setTimeout(() => (catIsAngry = false), 1_000);
  }
</script>

<main class="flex h-screen w-full flex-col items-center justify-center p-6">
  <div
    id={DROP_AREA_FLDST_ID}
    class="border-aura-yellow relative flex flex-col items-center justify-center gap-y-2 rounded-md border-2 px-4 py-6 lg:hidden"
  >
    <button ontouchstart={onTouch}>
      {#if catIsAngry}
        <span class="absolute -top-9 left-1/2 h-10 w-10 -translate-x-1/2">
          <CatAngry />
        </span>
      {:else}
        <span class="absolute -top-6.5 left-1/2 h-8 w-8 -translate-x-1/2"> <CatNotAngry /></span>
      {/if}
    </button>

    <span>
      {`This is a small project to experiment with the HTML Drag&Drop API. The goal is to create a
    node-based programming interface. Real-world use cases for such types of UI are far more
    complex than this demo, and they’re usually not meant for small devices. The JS
    is centered around mouse events - it wasn't tailored for touch events.`}</span
    >
    <span class="text-aura-yellow">{`Please, open this webapp from a laptop/desktop PC`}</span>
  </div>
</main>
