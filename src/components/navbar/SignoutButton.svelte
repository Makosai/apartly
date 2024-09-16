<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';

	let confirmation = false;
	let confirmationTimeout: NodeJS.Timeout;

	function confirm() {
		if (!confirmation) {
			confirmation = true;

			if (confirmationTimeout) {
				clearTimeout(confirmationTimeout);
			}

			confirmationTimeout = setTimeout(() => {
				confirmation = false;
			}, 2000);
		}
	}

	const handleSignOut: SubmitFunction = () => {
		goto('/');

		return async ({ update }) => {
			update();
		};
	};
</script>

{#if !confirmation}
	<button type="button" class="btn-base-orange pill" on:click={confirm}>
		{'Logout'}
	</button>
{:else}
	<form method="post" action="/?/signout" use:enhance={handleSignOut}>
		<button type="submit" class="btn-base-orange pill">
			{'Are you sure?'}
		</button>
	</form>
{/if}
