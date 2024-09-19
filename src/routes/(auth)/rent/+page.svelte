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

	let min_sq_footage: number | undefined = undefined;
	let max_sq_footage: number | undefined = undefined;
	let min_price: number | undefined = undefined;
	let max_price: number | undefined = undefined;
	let min_rooms: number | undefined = undefined;
	let max_rooms: number | undefined = undefined;
	let limit: number | undefined = undefined;

	getNearbyApartments();
	async function getNearbyApartments(long = 40.727611, lat = -73.841805) {
		const query = supabase.rpc('nearby_apartments', { lat, long });

    if (min_sq_footage) query.gte('sq_footage', min_sq_footage);
    if (max_sq_footage) query.lte('sq_footage', max_sq_footage);

    if (min_price) query.gte('monthly_price', min_price);
    if (max_price) query.lte('monthly_price', max_price);

    if (min_rooms) query.gte('rooms', min_rooms);
    if (max_rooms) query.lte('rooms', max_rooms);

    const { data, error } = await query.limit(limit || 10);

    if(error) {
      console.error(error);
      return;
    }

    if(!data) {
      listings = [];
      return;
    }

    listings = data;
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
		<div class="w-full flex flex-col justify-center items-center">
			<div class="grid grid-cols-2 gap-3">
				<div class="flex flex-col">
					<p>Sq. Feet</p>
					<div class="flex justify-start form-group">
						<input type="number" bind:value={min_sq_footage} placeholder="Min" class="w-20 mr-2" />
						<input type="number" bind:value={max_sq_footage} placeholder="Max" class="w-20" />
					</div>
				</div>

				<div class="flex flex-col">
					<p>Price Range</p>
					<div class="flex justify-start form-group">
						<input type="number" bind:value={min_price} placeholder="Min" class="w-20 mr-2" />
						<input type="number" bind:value={max_price} placeholder="Max" class="w-20" />
					</div>
				</div>

				<div class="flex flex-col">
					<p>Rooms</p>
					<div class="flex justify-start form-group">
						<input type="number" bind:value={min_rooms} placeholder="Min" class="w-20 mr-2" />
						<input type="number" bind:value={max_rooms} placeholder="Max" class="w-20" />
					</div>
				</div>

				<div class="flex flex-col form-group">
					<p>Limit</p>
					<input type="number" bind:value={limit} placeholder="Limit" class="w-20" />
				</div>
				<button class="btn-base-orange filled pill" on:click={() => getNearbyApartments()}>Search</button>
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
	</div></PageContainer
>

<style lang="postcss">
	.listing-container {
		@apply grid grid-cols-1 md:grid-cols-2 gap-4 mt-6;
	}
	.empty-listing {
		@apply col-span-2 flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-300px)];
	}
</style>
