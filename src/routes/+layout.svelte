<script lang="ts">
	import '../app.postcss';
	import '@fontsource-variable/inter';
	import Navbar from '$components/navbar/Navbar.svelte';
	import Footer from '$components/navbar/Footer.svelte';
	import { initializeStores, Toast, Modal } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { pageTitle } from '$lib/stores';
	import { invalidate } from '$app/navigation';

	initializeStores();

	export let data;
	const { supabase, session } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<title>{$pageTitle}</title>
</svelte:head>

<Toast />
<Modal />

<Navbar user={data.user} />

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
