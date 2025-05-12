<script lang="ts">
  let { vertex, isVertexIn } = $props();
  import { VERTEX_EL_CLASS } from '$lib/config/domConstants';
  //Iimport { outputOrTypeStore } from '$lib/store';
  const isDatavertex = vertex.type === 'data';
  import { getSelDataVertexId } from '$lib/state.svelte';
  import AddButton from './AddButton.svelte';
  import DelButton from './DelButton.svelte';
  const borderStyles = {
    all: {
      data: 'rounded-t-xs rounded-b-md',
      output: 'rounded-t-md rounded-b-xs',
      operation: 'rounded-md'
    },
    names: {
      data: 'rounded-t-xs',
      output: 'rounded-t-md',
      operation: 'rounded-t-md'
    },
    info: {
      data: 'rounded-b-md',
      output: 'rounded-b-xs',
      operation: 'rounded-b-md'
    }
  };

  function disableAdd(): boolean {
    return isDatavertex && getSelDataVertexId() !== null && getSelDataVertexId !== vertex.id;
  }
</script>

<div
  draggable={isVertexIn}
  id={vertex.id}
  data-vertex-type={vertex.type}
  data-output-name={vertex.output}
  class={`${VERTEX_EL_CLASS} group relative
    ${isVertexIn ? 'w-54 2xl:w-64' : ''}
    ${vertex.type === 'data' ? borderStyles.all.data : ''} 
    ${vertex.type === 'output' ? borderStyles.all.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.all.operation : ''}`}
>
  <div
    class={` flex h-2/3 w-full items-center justify-center break-normal border-2 px-4 text-center text-sm 2xl:text-base 
    ${isVertexIn ? 'px-6' : ''}
    ${vertex.type === 'data' ? borderStyles.names.data : ''} 
    ${disableAdd() ? 'border-aura-gray group-hover:border-aura-red' : 'group-hover:border-aura-yellow border-dark-green'}
    ${vertex.type === 'output' ? borderStyles.names.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.names.operation : ''}`}
  >
    {vertex.humanName}
  </div>
  <div
    class={`bg-vertex-info-bg flex h-1/3 w-full items-center justify-between break-normal border-x-2 border-b-2 px-1 text-center text-xs 2xl:text-sm
    ${vertex.type === 'data' ? borderStyles.info.data : ''} 
    ${disableAdd() ? 'border-aura-gray group-hover:border-aura-red' : 'group-hover:border-aura-yellow border-dark-green'}
    ${vertex.type === 'output' ? borderStyles.info.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.info.operation : ''}`}
  >
    <span class="text-aura-gray">{'type'}</span><span>{vertex.type}</span>
  </div>
  {#if !isVertexIn && !disableAdd()}
    <AddButton />
  {:else if isVertexIn}
    <DelButton />
    {#if vertex.type !== 'data'}
      <div
        class="border-aura-yellow bg-dark-purple group-hover:border-aura-green absolute -top-1.5 h-2.5 w-2 rounded-full border-2"
      ></div>
    {/if}
    {#if vertex.type !== 'output'}
      <div
        class="border-aura-yellow bg-dark-purple group-hover:border-aura-green absolute -bottom-1.5 h-2.5 w-2 rounded-full border-2 text-sm"
      ></div>
    {/if}
  {/if}
</div>
