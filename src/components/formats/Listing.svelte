<script lang="ts">
	import type { Database } from '$lib/db/types/supabase.types.ts';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { getPreviewUrl } from '$lib/info';
	import Icon from '@iconify/svelte';
	import { quadIn } from 'svelte/easing';
	import type { ToastStore } from '@skeletonlabs/skeleton';

	export let supabase: SupabaseClient<Database>;
	export let toast: ToastStore;

	export let listing: ListingData;
	export let destroy: () => void;
	export let confirmDelete = false;

	async function deleteListing() {
		{
			const { error } = await supabase.from('apartments').delete().eq('id', listing.id);
			if (error) {
				console.error(error);
				toast.trigger({
					message: 'Failed to delete listing.',
					timeout: 4000,
					background: 'bg-red-500'
				});
				return;
			}
		}

		const { error } = await supabase.storage
			.from('apartments_images')
			.remove([`${listing.owner_id}/${listing.id}`]);
		if (error) {
			console.error(error);
			toast.trigger({
				message: 'Failed to delete listing image.',
				timeout: 4000,
				background: 'bg-red-500'
			});
			return;
		}

		destroy();
		confirmDelete = false;
	}

	function fadeBg(_node: HTMLButtonElement, { duration = 4000, easing = quadIn }) {
		return {
			duration,
			delay: 0,
			easing,
			css: (t: number) => {
				const eased = easing(t);
				// white is 255, 255, 255 | red is 239, 68, 68. ease between the two.
				const r = 255 - (255 - 239) * eased;
				const g = 255 - (255 - 68) * eased;
				const b = g;
				return `color: rgb(${r} ${g} ${b});--tw-bg-opacity: ${1 - eased};--tw-border-opacity: ${eased};`;
			}
		};
	}
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
		<a href={`/realtor/edit/${listing.id}`} class="btn-base-orange filled pill basis-0 grow">Edit</a>
		{#if confirmDelete}
			<button
				class="btn-error filled pill basis-0 uppercase flex !border-solid"
				on:click={deleteListing}
				in:fadeBg={{}}
				on:introend={() => (confirmDelete = false)}
			>
				<p class="text-sm font-bold">Confirm</p>
				<Icon icon="mdi:trash-can" />
			</button>
		{:else}
			<button class="btn-error pill basis-0" on:click={() => (confirmDelete = true)}>
				<Icon icon="mdi:trash" />
			</button>
		{/if}
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
