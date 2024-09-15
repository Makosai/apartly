<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageData } from '../../routes/$types';
	import type { User } from '@supabase/supabase-js';

	const user: User = (getContext('data') as PageData).user;
</script>

<div class="nav-actions">
	{#if user !== null && user.user_metadata.account_type === 'realtor'}
		<a href="/realtor" class="btn-base-orange filled pill">Listings</a>
	{:else if user !== null && user.user_metadata.account_type === 'user'}
		<a href="/rent" class="btn-base-orange filled pill">Rent</a>
	{:else}
		<a href="/signup" class="btn-base-orange filled pill">Sign up</a>
	{/if}
</div>

<style lang="postcss">
	.nav-actions {
		@apply hidden ml:flex justify-center items-center gap-4 ml-auto;
	}
</style>
