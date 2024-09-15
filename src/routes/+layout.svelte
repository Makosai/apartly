<script lang="ts">
	import '../app.postcss';
	import '@fontsource-variable/inter';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/navbar/Footer.svelte';
	import { initializeStores, Toast } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<Toast />

<Navbar />

<div class="nav-container">
	<slot />
</div>

<Footer />

<style lang="postcss">
	.nav-container {
		@apply pt-[72px] pb-[102px] h-max;
	}
</style>
