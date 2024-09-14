<script lang="ts">
	import { sitename } from '$lib/info';
	import { navShown } from '$lib/stores';

	$: hideNav = () => ($navShown = false);
</script>

<a href="/" id="brand" class="un-a" on:click={hideNav}>
	<div id="brand-logo">
		<enhanced:img
			src="$assets/logos/appartly_logo.png?enhanced&w=184;168"
			alt="{sitename} Logo"
			title="{sitename}"
			sizes="(min-width: 768px) 84px, 92px"
		/>
	</div>
	<div class="hidden lg:block h-8 mx-4 border-r-2 border-solid" />
	<div id="brand-name">{sitename}</div>
</a>

<style lang="postcss">
	#brand {
		@apply flex justify-center items-center;
	}

	#brand-logo {
		@apply lg:w-[43px] w-[36px] m-auto lg:m-[unset];
	}

	#brand-name {
		@apply flex justify-start items-center mr-10;
		@apply hidden ml:block h4 ml-4;
	}
</style>
