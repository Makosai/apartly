<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import { onMount } from 'svelte';
	import NavBrand from './NavBrand.svelte';
	import NavActions from './NavActions.svelte';

	let lastScroll = 0;
	let turtle = false;
	$: turtleBar = turtle ? ' turtle' : ''; // Tucks away the navbar.

	export let user: User | null;

	onMount(() => {
		window.addEventListener('scroll', () => {
			if (window.scrollY > 86) {
				turtle = window.scrollY > 300 && window.scrollY > lastScroll ? true : false;
				lastScroll = window.scrollY;
			} else {
				turtle = false;
			}
		});
	});
</script>

<div class="navbar{turtleBar}">
	<NavBrand />
	<NavActions {user} />
</div>

<style lang="postcss">
	.navbar {
		@apply bg-white shadow-md h-[72px];
		@apply fixed top-0 left-0 right-0 z-50;
		@apply w-full py-2 px-4;
		@apply flex justify-between ml:justify-start items-center;
		@apply transition-[top] duration-[330ms] ease-in-out;
	}

	.turtle {
		top: -150px !important;
	}
</style>
