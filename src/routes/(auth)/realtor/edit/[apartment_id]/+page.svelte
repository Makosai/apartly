<script lang="ts">
	import { goto } from '$app/navigation';
	import PageContainer from '$components/formats/PageContainer.svelte';
	import { FileButton, getToastStore } from '@skeletonlabs/skeleton';
	import Map, { type Selection } from '$components/map/Map.svelte';
	import { pageTitle } from '$lib/stores';
	import { sitename } from '$lib/info';

	$pageTitle = `${sitename} - Edit Listing`;

	export let data;
	const { supabase, user, apartment_id } = data;
	const toast = getToastStore();

	let submitting = false;
	let selection: Selection | undefined;
	let files: FileList | undefined;

	let loaded_data: any | undefined = undefined;
	let title: string;
	let description: string;
	let sq_footage: string;
	let rooms: string;
	let price_per_month: string;

	loadApartment();

	async function loadApartment() {
		const { data, error } = await supabase
			.from('apartments')
			.select('title, description, sq_footage, rooms, monthly_price')
			.eq('id', apartment_id)
			.single();

		if (error) {
			toast.trigger({
				message: error.message,
				timeout: 2000,
				background: 'variant-filled-warning'
			});
			return;
		}

		if (data) {
			loaded_data = data;
			title = data.title;
			description = data.description;
			sq_footage = data.sq_footage.toString();
			rooms = data.rooms.toString();
			price_per_month = data.monthly_price.toString();
		}
	}

	function triggerToast(message: string, timeout = 2000, background = 'variant-filled-warning') {
		toast.trigger({ message, timeout, background });
	}

	function validateForm(formData: FormData): boolean {
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const sq_footage = formData.get('sq_footage') as string;
		const rooms = formData.get('rooms') as string;
		const price_per_month = formData.get('price_per_month') as string;

		// Files can be empty. It's optional to upload a new image.

		// Text fields must be filled since we auto populate it.

		if (!title) {
			triggerToast('Please enter a title.');
			return false;
		}

		if (!description || description.length === 0) {
			triggerToast('Please enter a description.');
			return false;
		}

		if (!sq_footage) {
			triggerToast('Please enter the square footage.');
			return false;
		}

		if (isNaN(Number(sq_footage))) {
			triggerToast('Square footage must be a number.');
			return false;
		}

		if (!rooms) {
			triggerToast('Please enter the number of rooms.');
			return false;
		}

		if (isNaN(Number(rooms))) {
			triggerToast('Number of rooms must be a number.');
			return false;
		}

		if (!price_per_month) {
			triggerToast('Please enter the price per month.');
			return false;
		}

		if (isNaN(Number(price_per_month))) {
			triggerToast('Price per month must be a number.');
			return false;
		}

		// Location is optional. We don't populate it.

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
			const dataEntries = Object.fromEntries(formData.entries());

			if (!validateForm(formData)) return;

			{
				// To be absolutely efficient, we should check if the data is different before updating.
				// But for the sake of simplicity, we'll just update it.
				// It's simple, but really it's overkill because we're not scaling this test app.
				const { error } = await supabase
					.from('apartments')
					.update({
						owner_id: user.id,
						title: dataEntries.title as string,
						description: dataEntries.description as string,
						sq_footage: Number(dataEntries.sq_footage as string),
						rooms: Number(dataEntries.rooms as string),
						monthly_price: Number(dataEntries.price_per_month as string),
						location: dataEntries.location as string,
						location_label: dataEntries.location_label as string
					})
					.eq('id', apartment_id);

				if (error) {
					toast.trigger({
						message: error.message,
						timeout: 2000,
						background: 'variant-filled-warning'
					});
					return;
				}
			}

			if (files && files.length > 0) {
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

				const { error } = await supabase.storage
					.from('apartments_images')
					.upload(`/${user.id}/${apartment_id}/preview`, file, {
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
			}

			toast.trigger({
				message: 'Listing added successfully!',
				timeout: 2000,
				background: 'variant-filled-success'
			});

			goto('/realtor');
		} catch (error) {
			console.error(error);
		} finally {
			submitting = false;
		}
	}
</script>

<PageContainer>
	<h1 class="title">Edit Listing</h1>
	<p class="subtitle">Change the information for Apartment ID#{apartment_id}</p>

	<div class="flex justify-center items-center">
		<form class="form-container" on:submit|preventDefault={submitForm}>
			<div class="form-group">
				<label for="title">Title</label>
				<input type="text" id="title" name="title" bind:value={title} required />
			</div>

			<div class="form-group md:col-span-2">
				<label for="description">Description</label>
				<textarea id="description" name="description" bind:value={description} required></textarea>
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
					bind:value={sq_footage}
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
					bind:value={rooms}
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
					bind:value={price_per_month}
				/> USD
			</div>

			<div class="form-group">
				<label for="preview-image-url">Preview Image</label>
				<p>It's optional to upload an image to replace the old one.</p>
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
				<p>
					Search for a location on the map below <strong
						>if you want to change your old location</strong
					>.
				</p>
				<p>{selection?.label ?? ''}</p>
				<div class="w-full h-[300px]">
					<Map bind:selection />
				</div>
			</div>

			<div class="form-group">
				<button type="submit" class="btn-base-orange filled pill">
					{submitting ? 'Updating Your Listing...' : 'Update Your Listing'}
				</button>
			</div>
		</form>
	</div>
</PageContainer>
