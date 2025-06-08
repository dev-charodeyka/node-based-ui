<script lang="ts">
  import { EDGES_SVG_LAYER_ID } from '$lib/config/domConstants';
  import { EDGE_COLOR } from '$lib/config/stylesAndClasses';
  import { getEdgesAnchors } from '$lib/state.svelte';
</script>

<svg id={EDGES_SVG_LAYER_ID} class="pointer-events-none absolute left-0 top-0 z-50 h-full w-full"
  >{#each Object.entries(getEdgesAnchors()) as [edgeId, { x1, y1, x2, y2 }]}
    <path
      id={edgeId}
      d={`
        M${x1},${y1}
        C${x1 + (x2 - x1) / 2},${y1}
         ${x2 - (x2 - x1) / 2},${y2}
         ${x2},${y2}`}
      stroke={EDGE_COLOR}
      stroke-width="2"
      fill="none"
    >
    </path>{/each}</svg
>
