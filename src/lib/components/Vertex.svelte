<script lang="ts">
  let { vertex } = $props();
</script>

<div
  draggable="true"
  id={vertex.id}
  class={`vertex group 
    ${vertex.type === 'data' ? 'rounded-b-xs rounded-t-md' : ''} 
    ${vertex.type === 'output' ? 'rounded-t-xs rounded-b-md' : ''} 
    ${vertex.type === 'operation' ? 'rounded-md' : ''}`}
  data-drop-area-id="codeEditorDiv"
>
  <div
    class="flex h-2/3 w-full items-center justify-center break-normal px-4 text-center font-medium"
  >
    {vertex.humanName}
  </div>
  <div class="bg-aura-yellow text-aura-black h-1/3 w-full text-center text-sm">
    {vertex.type}
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
