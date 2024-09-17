<script lang="ts">
	import { getPreviewUrl } from '$lib/info';

	export let listing: ListingData;
</script>

<div class="card">
	<img src={getPreviewUrl(listing.owner_id, listing.id)} alt={listing.title} />
	<h2>{listing.title}</h2>
	<p>{listing.description}</p>
	<p>{listing.sq_footage} sq. ft.</p>
	<p>{listing.rooms} rooms</p>
	<p>${listing.monthly_price}/month</p>
	<p>{listing.location_label}</p>
	<div class="flex justify-between">
		<a href="/realtor/edit/{listing.id}" class="btn-base-orange filled">Edit</a>
		<button class="btn-base-red filled">Delete</button>
	</div>
</div>
