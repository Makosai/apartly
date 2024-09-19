<script lang="ts">
	import FloatingButton from '$components/formats/FloatingButton.svelte';
	import NearbyListing from '$components/formats/NearbyListing.svelte';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import Map, { type Selection } from '$components/map/Map.svelte';
	import { ProgressBar, getToastStore } from '@skeletonlabs/skeleton';
	import { writable } from 'svelte/store';

	$: listings = undefined as NearbyListingData[] | undefined;

	const toast = getToastStore();

	export let data;
	const { supabase } = data;
	let selectionState = writable<Selection | undefined>(undefined);

	selectionState.subscribe((value) => {
		if (value === undefined) return;
		getNearbyApartments(value?.y, value.x);
	});

	getNearbyApartments();
	function getNearbyApartments(long = 40.727611, lat = -73.841805) {
		supabase.rpc('nearby_apartments', { lat, long }).then(({ data, error }) => {
			if (error) {
				console.error(error);
				return;
			}

			if (!data) {
				listings = [];
				return;
			}
			listings = data;
		});
	}
</script>

<FloatingButton href="/realtor/add" />

<PageContainer>
	<h1 class="title">Rent: Search for Listings</h1>
	<p class="subtitle">
		{#if listings === undefined}
			... listings found.
		{:else}
			{listings.length} listings found.
		{/if}
	</p>
	<div class="flex justify-center items-center flex-col">
		<div class="h-[600px] w-full">
			<Map selection={selectionState} />
		</div>
		<div class="listing-container">
			{#if !listings}
				<div class="empty-listing max-w-lg w-full mx-auto">
					<ProgressBar />
				</div>
			{:else if listings.length === 0}
				<div class="empty-listing">
					<p class="text-center">No listings found. Try searching again?</p>
				</div>
			{:else}
				{#each listings as listing}
					<NearbyListing {listing} />
				{/each}
			{/if}
		</div>
	</div>
</PageContainer>

<style lang="postcss">
	.listing-container {
		@apply grid grid-cols-1 md:grid-cols-2 gap-4 mt-6;
	}
	.empty-listing {
		@apply col-span-2 flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-300px)];
	}
</style>
