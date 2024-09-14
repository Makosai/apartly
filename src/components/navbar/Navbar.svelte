<script lang="ts">
	import { onMount } from 'svelte';
	import Hamburger from './Hamburger.svelte';
	import NavBrand from './NavBrand.svelte';
	import NavItems from './NavItems.svelte';
	import NavItemsMobile from './NavItemsMobile.svelte';
	import NavActions from './NavActions.svelte';

	let lastScroll = 0;
	let turtle = false;
	$: turtleBar = turtle ? ' turtle' : ''; // Tucks away the navbar.

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
	<Hamburger />
	<NavBrand />
  <NavItems />
  <NavItemsMobile />
  <NavActions />
</div>

<style lang="postcss">
	.navbar {
    @apply bg-white shadow-md h-[72px];
		@apply ml:justify-center;
		@apply fixed top-0 left-0 right-0 z-50;
		@apply w-full py-2 px-4;
		@apply flex justify-center ml:justify-start items-center;
		@apply transition-[top] duration-[330ms] ease-in-out;
	}

  .turtle {
		top: -150px !important;
	}
</style>
