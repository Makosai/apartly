<script lang="ts">
	import { sitename } from '$lib/info';
	import { pageTitle } from '$lib/stores';
	import PageContainer from '$components/formats/PageContainer.svelte';

	export let data;
	const { supabase, session, user } = data;

	$pageTitle = `${sitename} - Rent easy.`;
</script>

<div class="hero">
	<div class="hero-contents">
		<div class="title">{sitename}</div>
		<div class="subtitles">
			<div class="subtitle text-[--base-orange]">Rent.</div>
			<div class="subtitle text-[#505bf8]">Sell.</div>
			<div class="subtitle text-success-700">Easy.</div>
		</div>
		<p>
			Welcome to {sitename}! Where you can find apartments easier than before. We bring you great
			listings wherever you are. We are passionate about making the process of finding a new place
			to live easier. We know how hard it can be to find a place that fits your needs, so we created
			{sitename} to help you find the perfect place to call home.
		</p>
	</div>
</div>

<PageContainer>
	<div class="cta">
		<div class="renters-cta">
			<h2>Are you looking to rent an apartment?</h2>
			<p>
				{sitename} is the perfect place to find your next apartment. We have a wide selection of apartments
				to choose from, so you can find the perfect place to call home. Whether you are looking for a
				studio apartment, a one-bedroom apartment, or a two-bedroom apartment, we have something for
				everyone. Our listings are updated immediately, so you can be sure that you are getting the most
				up-to-date information on available apartments. Start your search today and find your dream apartment
				with {sitename}.
			</p>
			<a href="/signup?as=user" class="btn-base-orange filled pill">Rent Now</a>
		</div>

		<div class="realtors-cta">
			<h2>Are you a realtor looking to sell?</h2>
			<p>
				{sitename} is the perfect place to list your apartments. We make it easy for you to list your
				apartments and reach a wide audience of potential renters. Our platform is easy to use and allows
				you to manage your listings with ease. We offer a variety of tools to help you manage your listings
				and connect with renters. Start listing your apartments today and reach a wider audience with
				{sitename}.
			</p>
			<a href="/signup?as=realtor" class="btn-base-orange filled pill">Sell Today</a>
		</div>
	</div>
</PageContainer>

<style lang="postcss">
	.hero {
		@apply bg-[hsl(83,100%,99%)] p-12;
	}
	.hero-contents {
		@apply max-w-[1500px] mx-auto;
	}
	.hero .title {
		@apply text-6xl font-extrabold;
	}
	.hero .subtitles {
		@apply flex gap-4 pt-4;
	}
	.hero .subtitle {
		@apply text-3xl font-bold;
	}
	.hero p {
		@apply max-w-[500px] text-[#080808] text-lg pt-4;
	}

	.cta {
		@apply pt-8 grid md:grid-cols-2 grid-rows-2 md:grid-rows-none gap-8 max-w-[1500px] mx-auto;
	}
	.cta div {
		@apply bg-white p-8 rounded-lg shadow-sm;
	}
	.cta p {
		@apply pt-2 pb-4 text-base max-w-[600px];
	}
	.cta a {
		@apply font-medium;
	}
</style>
