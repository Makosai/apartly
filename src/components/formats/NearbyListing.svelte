<script lang="ts">
	import { getPreviewUrl } from '$lib/info';

	export let listing: NearbyListingData;
</script>

<div class="card">
	<img src={getPreviewUrl(listing.owner_id, listing.id)} alt={listing.title} />
	<h3>{listing.title}</h3>
	<p>by {listing.first_name} {listing.last_name}</p>
	<p>{listing.description}</p>
	<p>{listing.sq_footage} sq. ft.</p>
	<p>{listing.rooms} rooms</p>
	<p>${listing.monthly_price.toFixed(2)}/month</p>
	<p>{(listing.dist_meters / 1609.344).toFixed(2)} miles away</p>
	<p>{listing.location_label}</p>
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
		@apply flex flex-col gap-1;
		@apply max-w-md w-full mx-auto;
	}
</style>
