<script lang="ts">
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { supabase } from '$lib/supabaseClient';
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton';
	import Map from '$components/map/Map.svelte';

	export let data;
	const { user } = data;

	const toast = getToastStore();

	let files: FileList | undefined;

	async function submitForm(e: Event) {
		e.preventDefault();

		if(!user) return; // The should be set anyways. This page redirects them automatically if not.

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());

		// supabase.storage.from('apartments_images').upload(`/${user.id}/${files[0].name}`, files[0]);

		const { error } = await supabase.from('apartments').insert({
			title: data.title,
			description: data.description,
			sq_footage: data.sq_footage,
			rooms: data.rooms,
			price_per_month: data.price_per_month,
			location: data.location
		});

		if (error) {
			toast.trigger({
				message: error.message,
				timeout: 2000,
				background: 'variant-filled-warning'
			});
		} else {
			toast.trigger({
				message: 'Listing added successfully!',
				timeout: 2000,
				background: 'variant-filled-success'
			});
		}
	}
</script>

<PageContainer>
	<h1 class="title">Add Listing</h1>
	<p class="subtitle">Add a new listing.</p>

	<div class="flex justify-center items-center">
		<form
			class="form-container"
			on:submit|preventDefault={submitForm}
			on:invalid={() => console.log('hi')}
		>
			<div class="form-group">
				<label for="title">Title</label>
				<input type="text" id="title" required />
			</div>

			<div class="form-group md:col-span-2">
				<label for="description">Description</label>
				<textarea id="description" required></textarea>
			</div>

			<div class="form-group">
				<label for="sq-footage">Square Footage</label>
				<input type="number" id="sq-footage" placeholder="5" step="1" required pattern="[0-9]+" /> sq/ft
			</div>

			<div class="form-group">
				<label for="rooms">Number of Rooms</label>
				<input type="number" id="rooms" placeholder="5" step="1" required pattern="[0-9]+" /> rooms
			</div>

			<div class="form-group">
				<label for="price-per-month">Price Per Month</label>
				$<input
					type="number"
					id="price-per-month"
					placeholder="800.00"
					step="0.01"
					required
					pattern=/(?:^[1-9]([0-9]+)?(?:\.[0-9]\{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/
				/> USD
			</div>

			<div class="form-group">
				<label for="preview-image-url">Preview Image</label>
				{#if files && files.length > 0}
					<p>
						File name: {files[0].name}
						<br />
						<img
							src={URL.createObjectURL(files[0])}
							alt="Apartment Preview"
							class="h-24 max-h-52 max-w-52 mb-6"
						/>
					</p>
				{/if}
				<FileButton id="preview-image-url" name="preview_image_url" bind:files required />
			</div>

			<div class="form-group md:col-span-2">
				<label for="location">Location</label>
				<div class="w-full h-[300px]">
					<Map />
				</div>
			</div>

			<div class="form-group">
				<button type="submit" class="btn-base-orange filled pill">Finish Posting Listing</button>
			</div>
		</form>
	</div>
</PageContainer>

<style lang="postcss">
	.form-container {
		@apply grid w-full grid-cols-1 md:grid-cols-2 md:grid-rows-none gap-x-10 gap-y-0 	md:gap-y-4;
	}

	.form-container textarea {
		@apply w-full;
	}
</style>
