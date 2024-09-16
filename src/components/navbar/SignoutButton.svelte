<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	let confirmation = false;
	let confirmationTimeout: NodeJS.Timeout;

	function confirm(e: FormElementEvent) {
		if (!confirmation) {
			e.preventDefault();
			confirmation = true;

			if (confirmationTimeout) {
				clearTimeout(confirmationTimeout);
			}

			confirmationTimeout = setTimeout(() => {
				confirmation = false;
			}, 2000);
			return false;
		}

		if (e.target != null) {
			const target = e.target as HTMLFormElement;
			target.submit();
		}
	}

	const handleSignOut: SubmitFunction = () => {
		return async ({ update }) => {
			update();
		};
	};
</script>

<form on:submit={confirm} method="post" action="/?/signout" use:enhance={handleSignOut}>
	<button type="submit" class="btn-base-orange pill">
		{confirmation ? 'Are you sure?' : 'Logout'}
	</button>
</form>
