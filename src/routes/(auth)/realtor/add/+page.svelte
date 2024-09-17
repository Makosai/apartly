<script lang="ts">
	import { goto } from '$app/navigation';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton';
	import Map, { type Selection } from '$components/map/Map.svelte';

	export let data;
	const { supabase, user } = data;
	const toast = getToastStore();

	let submitting = false;
	let selection: Selection | undefined;
	let files: FileList | undefined;

	function validateForm(formData: FormData): boolean {
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const sq_footage = formData.get('sq_footage') as string;
		const rooms = formData.get('rooms') as string;
		const price_per_month = formData.get('price_per_month') as string;
		const location = formData.get('location') as string;
		const location_label = formData.get('location_label') as string;

		if (!files || files.length === 0) {
			toast.trigger({
				message: 'Please upload a preview image.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!title) {
			toast.trigger({
				message: 'Please enter a title.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!description || description.length === 0) {
			toast.trigger({
				message: 'Please enter a description.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!sq_footage) {
			toast.trigger({
				message: 'Please enter the square footage.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (isNaN(Number(sq_footage))) {
			toast.trigger({
				message: 'Square footage must be a number.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!rooms) {
			toast.trigger({
				message: 'Please enter the number of rooms.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (isNaN(Number(rooms))) {
			toast.trigger({
				message: 'Number of rooms must be a number.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!price_per_month) {
			toast.trigger({
				message: 'Please enter the price per month.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (isNaN(Number(price_per_month))) {
			toast.trigger({
				message: 'Price per month must be a number.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!location) {
			toast.trigger({
				message: 'Please select a location.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		if (!location_label) {
			toast.trigger({
				message: 'Please select a location.',
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return false;
		}

		return true;
	}

	async function submitForm(e: Event) {
		try {
			submitting = true;

			e.preventDefault();

			if (!user) return; // The should be set anyways. This page redirects them automatically if not.

			const form = e.target as HTMLFormElement;
			const formData = new FormData(form);
			if (selection) {
				formData.append('location', `POINT(${selection.y} ${selection.x})`);
				formData.append('location_label', selection.label);
			}
			const data = Object.fromEntries(formData.entries());

			if (!validateForm(formData)) return;
			if (!files || files.length <= 0) return; // Handled in validateForm, this just shuts up JS.

			const file = files.item(0);
			if (file === null) return;
			const fileType = file.type.split('/')[1];

			if (fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg') {
				toast.trigger({
					message: 'Preview image must be a PNG or JPEG file.',
					timeout: 2000,
					background: 'variant-filled-warning'
				});
				return;
			}

			{
				const { error, data } = await supabase.storage
					.from('apartments_images')
					.upload(`/${user.id}/preview`, file, {
						cacheControl: '3600',
						upsert: true
					});

				if (error) {
					toast.trigger({
						message: error.message,
						timeout: 2000,
						background: 'variant-filled-warning'
					});
					return;
				}

				if (data) {
					console.log(data);
				}
			}

			const { error } = await supabase.from('apartments').insert({
				owner_id: user.id,
				title: data.title as string,
				description: data.description as string,
				sq_footage: Number(data.sq_footage as string),
				rooms: Number(data.rooms as string),
				monthly_price: Number(data.price_per_month as string),
				location: data.location as string,
				location_label: data.location_label as string
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

				goto('/realtor');
			}
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
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
				<input type="text" id="title" name="title" required />
			</div>

			<div class="form-group md:col-span-2">
				<label for="description">Description</label>
				<textarea id="description" name="description" required></textarea>
			</div>

			<div class="form-group">
				<label for="sq-footage">Square Footage</label>
				<input
					type="number"
					id="sq-footage"
					name="sq_footage"
					placeholder="5"
					step="1"
					required
					pattern="[0-9]+"
				/> sq/ft
			</div>

			<div class="form-group">
				<label for="rooms">Number of Rooms</label>
				<input
					type="number"
					id="rooms"
					name="rooms"
					placeholder="5"
					step="1"
					required
					pattern="[0-9]+"
				/> rooms
			</div>

			<div class="form-group">
				<label for="price-per-month">Price Per Month</label>
				$<input
					type="number"
					id="price-per-month"
					name="price_per_month"
					placeholder="800.00"
					step="0.01"
					required
					pattern="/(?:^[1-9]([0-9]+)?(?:\.[0-9]\{(1,
					2)})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/"
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
				<FileButton
					id="preview-image-url"
					name="preview_image_url"
					bind:files
					accept="image/png|image/jpeg"
				/>
			</div>

			<div class="form-group md:col-span-2">
				<label for="location">Location</label>
				<p>Search for a location on the map below.</p>
				<p>{selection?.label ?? ''}</p>
				<div class="w-full h-[300px]">
					<Map bind:selection />
				</div>
			</div>

			<div class="form-group">
				<button type="submit" class="btn-base-orange filled pill">
					{submitting ? 'Adding Your Listing...' : 'Finish Posting Listing'}
				</button>
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
