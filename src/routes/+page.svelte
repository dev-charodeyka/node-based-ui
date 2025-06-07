<script lang="ts">
  import LandingPageMouse from '$lib/components/LandingPageMouse.svelte';
  import LandingPageTouch from '$lib/components/LandingPageTouch.svelte';
  import { handleClearCodeEditor } from '$lib/utils/delAddActions.svelte';
  let innerWidth: number = $state(0);
  let innerHeight: number = $state(0);
</script>

<svelte:window bind:innerHeight bind:innerWidth onresize={handleClearCodeEditor} />

{#if innerWidth >= 1024}
  <LandingPageMouse />
{:else}
  <LandingPageTouch />
{/if}
