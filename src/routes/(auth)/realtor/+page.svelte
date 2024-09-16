<script lang="ts">
	import PageContainer from '$components/formats/PageContainer.svelte';
	import ModalListingForm from '$components/forms/ModalListingForm.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modal = getModalStore();

	const modalSettings: ModalSettings = {
		type: 'component',
		component: { ref: ModalListingForm },
		title: 'Add Listing',
		body: 'Fill out the form below to add a new listing.'
	};

	let listings = [];

	function showListingForm() {
		// Show the listing form modal.
		modal.trigger(modalSettings);
	}

	export let data;
	const { user } = data;
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

<PageContainer>
	<h1 class="title">Your Listings</h1>
	<p class="subtitle">View & manage your listings.</p>
	<div class="listing-container">
		{#if listings.length === 0}
			<div class="empty-listing">
				<p class="text-center">You have no listings yet.</p>
				<button class="btn-base-orange filled pill" on:click={showListingForm}>Add Listing</button>
			</div>
		{/if}
	</div>
</PageContainer>

<style lang="postcss">
	.listing-container {
		@apply grid grid-cols-2 gap-4;
	}
	.empty-listing {
		@apply col-span-2 flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-300px)];
	}
</style>
