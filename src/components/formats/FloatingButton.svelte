<script lang="ts">
	import Icon from '@iconify/svelte';

	export let href;
</script>

<a {href} class="floating-button">
	<Icon icon="mdi:plus" />
</a>

<style lang="postcss">
  .floating-button {
    @apply fixed bottom-6 right-6 z-50;
    @apply rounded-full text-black font-bold bg-[--base-orange];
    @apply w-14 h-14 flex justify-center items-center text-2xl;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color color 0.2s;
  }

  .floating-button:hover {
    @apply bg-black text-white;
  }
</style>