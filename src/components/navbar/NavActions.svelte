<script lang="ts">
	import type { User } from '@supabase/supabase-js';
	import SignoutButton from './SignoutButton.svelte';

	export let user: User | null;
</script>

<div class="nav-actions">
	{#if user?.user_metadata.account_type === 'realtor'}
		<SignoutButton />
		<a href="/realtor" class="btn-base-orange filled pill">Listings</a>
	{:else if user?.user_metadata.account_type === 'user'}
		<SignoutButton />
		<a href="/rent" class="btn-base-orange filled pill">Rent</a>
	{:else}
	<a href="/signin" class="btn-base-orange pill">Sign in</a>
		<a href="/signup" class="btn-base-orange filled pill">Sign up</a>
	{/if}
</div>

<style lang="postcss">
	.nav-actions {
		@apply flex justify-center items-center gap-4 ml-auto;
	}
</style>
