<script lang="ts">
	import '../app.postcss';
	import '@fontsource-variable/inter';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/navbar/Footer.svelte';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';
	import { setContext } from 'svelte';

	initializeStores();

	export let data;
	setContext('data', data);
</script>

<Toast />

<Navbar />

<div class="nav-container">
	<slot />
</div>

<Footer />

<style lang="postcss">
	.nav-container {
		@apply pt-[72px] h-max;
		min-height: calc(100% - 102px);
	}
</style>
