<script lang="ts">
	import FloatingButton from '$components/formats/FloatingButton.svelte';
	import Listing from '$components/formats/Listing.svelte';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { ProgressBar, getToastStore } from '@skeletonlabs/skeleton';

	$: listings = undefined as ListingData[] | undefined;

	const toast = getToastStore();

	export let data;
	const { supabase, user } = data;

	supabase
		.from('apartments')
		.select()
		.eq('owner_id', user.id)
		.then(({ data, error }) => {
			if (error) {
				console.error(error);
				return;
			}
			listings = data;
		});
</script>

<!-- 

Realtor Page
1. Put a floating + button on the bottom right corner of the screen.
2. When the button is clicked, it should open a modal with a form to add a new property.
3. The form should have the following fields:
   - Property name
   - Preview image
   - Description
   - Square footage
   - Number of rooms
   - $/month
   - Location (lat/long), this will pop up a map to select the location.

4. The page will list all properties the user owns. A simple filter.
5. Each property should have a button to edit or delete the property.
6. The edit button should open the same modal as the + button but with the property details filled in.
7. The delete button should delete the property after a confirmation dialog.

-->

<FloatingButton href="/realtor/add" />

<PageContainer>
	<h1 class="title">Your Listings</h1>
	<p class="subtitle">View & manage your listings.</p>
	<div class="flex justify-center">
		<div class="listing-container">
			{#if !listings}
				<div class="empty-listing max-w-lg w-full mx-auto">
					<ProgressBar />
				</div>
			{:else if listings.length === 0}
				<div class="empty-listing">
					<p class="text-center">You have no listings yet.</p>
					<a href="/realtor/add" class="btn-base-orange filled pill">Add Listing</a>
				</div>
			{:else}
				{#each listings as listing, i}
					<Listing
						{listing}
						{supabase}
						{toast}
						destroy={() => {
							if (listings) {
								listings.splice(i, 1);
								listings = listings;
							}
						}}
					/>
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
