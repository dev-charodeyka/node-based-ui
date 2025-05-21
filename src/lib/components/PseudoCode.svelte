<script lang="ts">
  import { getEdges, getSelDataVertexId } from '$lib/state.svelte';
  import vertices from '$lib/alg/vertices';
  import { traversePcaGraph } from '$lib/alg/pcaAlg';
  let selEdgesSet: Set<string> = new Set();
  let traversedPath: string[] = $state([]);
  function algInputPlaceholder() {
    return traversedPath.length > 0
      ? vertices.find((vertex) => vertex.id === traversedPath[0])?.codeName
      : (vertices.find((vertex) => vertex.id === getSelDataVertexId())?.codeName ?? 'dataset');
  }

  $effect(() => {
    selEdgesSet = new Set(getEdges().map((edge) => edge.edgeId));
    traversedPath = traversePcaGraph(selEdgesSet);
  });
</script>

<div class="grid h-full w-full grid-rows-10 text-xs">
  <div class="justify-left flex h-full w-full items-center text-sm">
    <span>{'> algorithmPCA('}</span>
    <span class="bg-aura-darkpurple border-aura-green rounded-md border px-1 py-0.5 text-center"
      >{algInputPlaceholder()}</span
    >
    <span>{'):'}</span>
  </div>
  {#each traversedPath.slice(1) as step, i (step)}
    <div class="justify-left flex h-full w-full items-center pl-6 text-sm">
      <span class="bg-aura-darkpurple border-aura-green rounded-md border px-1 py-0.5 text-center"
        >{vertices.find((vertex) => vertex.id === step)?.output || 'output'}</span
      >
      {'<-'}<span class=" rounded-md px-1 py-0.5 text-center"
        >{vertices.find((vertex) => vertex.id === step)?.codeName || 'operation'}</span
      >
      <span>{'('}</span>
      <span class="bg-aura-darkpurple rounded-md px-1 py-0.5 text-center"
        >{vertices.find((vertex) => vertex.id === traversedPath[i])?.output || 'Input'}</span
      >
      <span>{')'}</span>
    </div>
  {/each}
  <div class="justify-left flex h-full w-full items-center pl-6 text-base">
    <span class="pr-2">{'return'}</span>
    <span class="bg-aura-darkpurple rounded-md px-1 py-0.5 text-center"
      >{vertices.find((vertex) => vertex.id === traversedPath[traversedPath.length - 1])?.output ||
        vertices.find((vertex) => vertex.id === getSelDataVertexId())?.output ||
        'output'}</span
    >
  </div>
</div>
