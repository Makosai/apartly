<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	type FormData = {
		title: string | undefined;
		previewImageURL: string | undefined;
		sqFootage: number | undefined;
		rooms: number | undefined;
		pricePerMonth: number | undefined;
		location:
			| {
					lat: number;
					lng: number;
			  }
			| undefined;
	};

	// Form Data
	const formData: FormData = {
		title: undefined,
		previewImageURL: undefined,
		sqFootage: undefined,
		rooms: undefined,
		pricePerMonth: undefined,
		location: undefined
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm} grid md:grid-cols-2 grid-cols-1">
			<div>
				<label for="title">Title</label>
				<input type="text" id="title" bind:value={formData.title} required />
			</div>

			<div>
				<label for="preview-image-url">Preview Image URL</label>
				<input type="text" id="preview-image-url" bind:value={formData.previewImageURL} required />
			</div>

			<div>
				<label for="sq-footage">Square Footage</label>
				<input type="number" id="sq-footage" bind:value={formData.sqFootage} required />
			</div>

			<div>
				<label for="rooms">Number of Rooms</label>
				<input type="number" id="rooms" bind:value={formData.rooms} required />
			</div>
			<div>
				<label for="price-per-month">Price Per Month</label>
				<input type="number" id="price-per-month" bind:value={formData.pricePerMonth} required />
			</div>

			<div class="col-span-2 w-full">
				<label for="location">Location</label>
				<input
					type="text"
					id="location"
					class="w-full h-48"
					bind:value={formData.location}
					required
				/>
			</div>
		</form>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>{parent.buttonTextSubmit}</button>
		</footer>
	</div>
{/if}
