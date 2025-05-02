<script lang="ts">
  let { vertex } = $props();
  import { VERTEX_EL_CLASS } from '$lib/config/stylesAndClasses';
  import { outputOrTypeStore } from '$lib/store';

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
  let dataToDisplay: string = $state('type');
  let storeValue: string = $state('type');
  $effect(() => {
    storeValue = $outputOrTypeStore;
    if (storeValue === 'type') {
      dataToDisplay = vertex.type;
    } else if (storeValue === 'output') {
      dataToDisplay = vertex.output;
    }
  });
</script>

<div
  draggable="true"
  id={vertex.id}
  data-vertex-type={vertex.type}
  data-output-name={vertex.output}
  class={`${VERTEX_EL_CLASS} group 
    ${vertex.type === 'data' ? borderStyles.all.data : ''} 
    ${vertex.type === 'output' ? borderStyles.all.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.all.operation : ''}`}
>
  <div
    class={`group-hover:border-aura-yellow border-aura-purple flex h-2/3 w-full items-center justify-center break-normal border-2 px-4 text-center text-sm 2xl:text-base 2xl:font-medium
    ${vertex.type === 'data' ? borderStyles.names.data : ''} 
    ${vertex.type === 'output' ? borderStyles.names.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.names.operation : ''}`}
  >
    {vertex.humanName}
  </div>
  <div
    class={`border-dark-green group-hover:border-aura-yellow bg-vertex-info-bg border-x-2 text-xs flex h-1/3 w-full items-center justify-between break-normal border-b-2 px-1 text-center 2xl:text-sm
    ${vertex.type === 'data' ? borderStyles.info.data : ''} 
    ${vertex.type === 'output' ? borderStyles.info.output : ''} 
    ${vertex.type === 'operation' ? borderStyles.info.operation : ''}`}
  >
    <span class="text-aura-gray">{storeValue}</span><span>{dataToDisplay}</span>
  </div>
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
</div>
