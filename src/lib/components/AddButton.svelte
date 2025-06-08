<script lang="ts">
  import { handleAddVertex } from '$lib/utils/delAddActions.svelte';
</script>

<button
  onclick={handleAddVertex}
  class="text-aura-purple [&:hover>svg>path:first-child]:text-aura-yellow [&:hover>svg>path:first-child]:stroke-aura-yellow [&:hover>svg>g>path]:text-dark-purple absolute -bottom-3.5 h-7 cursor-pointer rounded-full"
  ><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24"
    ><!-- Icon from Myna UI Icons by Praveen Juge - https://github.com/praveenjuge/mynaui-icons/blob/main/LICENSE -->
    <path
      class="group-hover:animate-rotate text-vertex-info-bg stroke-aura-purple origin-center fill-current"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.5"
      d="M20.5 15.8V8.2a1.91 1.91 0 0 0-.944-1.645l-6.612-3.8a1.88 1.88 0 0 0-1.888 0l-6.612 3.8A1.9 1.9 0 0 0 3.5 8.2v7.602a1.91 1.91 0 0 0 .944 1.644l6.612 3.8a1.88 1.88 0 0 0 1.888 0l6.612-3.8A1.9 1.9 0 0 0 20.5 15.8"
    />
    <g transform="translate(12 12) scale(0.6) translate(-12 -12)">
      <!-- Icon from Myna UI Icons by Praveen Juge - https://github.com/praveenjuge/mynaui-icons/blob/main/LICENSE -->
      <path
        class="stroke-aura-purple fill-current"
        d="M13 6a1 1 0 1 0-2 0v5H6a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5z"
      />
    </g></svg
  >
</button>
