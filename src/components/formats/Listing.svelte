<script lang="ts">
	import { getPreviewUrl } from '$lib/info';
	import Icon from '@iconify/svelte';

	export let listing: ListingData;
</script>

<div class="card">
	<div class="flex flex-col">
		<img src={getPreviewUrl(listing.owner_id, listing.id)} alt={listing.title} />
		<h3>{listing.title}</h3>
		<p>{listing.description}</p>
		<p>{listing.sq_footage} sq. ft.</p>
		<p>{listing.rooms} rooms</p>
		<p>${listing.monthly_price}/month</p>
		<p>{listing.location_label}</p>
	</div>
	<div class="flex justify-end gap-4 mt-4">
		<button class="btn-base-orange filled pill basis-0 grow">Edit</button>
		<button class="btn-error pill basis-0">
			<Icon icon="mdi:trash" />
		</button>
	</div>
</div>

<style lang="postcss">
	p {
		@apply text-sm;
	}
	img {
		@apply rounded-2xl mb-4;
    @apply w-[415px] h-[280px];
	}
	.card {
		@apply bg-white shadow-md rounded-3xl p-4;
		@apply flex flex-col justify-between;
		@apply max-w-md w-full mx-auto;
	}
</style>
