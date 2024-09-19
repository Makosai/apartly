<script lang="ts">
	import { sitename } from '$lib/info';
	import { pageTitle } from '$lib/stores';
	import Data from './data/AllData';

	$pageTitle = `${sitename} - Realtor`;
</script>

<h1>Changelog</h1>

{#each Data as { version, date, changes }}
	<h2>{version} ({date})</h2>
	<ul>
		{#if changes.added.length > 0}
			<h3>Added</h3>
			{#each changes.added as add}
				<li>{add}</li>
			{/each}
		{/if}

		{#if changes.changed.length > 0}
			<h3>Changed</h3>
			{#each changes.changed as change}
				<li>{change}</li>
			{/each}
		{/if}

		{#if changes.deprecated.length > 0}
			<h3>Deprecated</h3>
			{#each changes.deprecated as deprecate}
				<li>{deprecate}</li>
			{/each}
		{/if}

		{#if changes.removed.length > 0}
			<h3>Removed</h3>
			{#each changes.removed as remove}
				<li>{remove}</li>
			{/each}
		{/if}

		{#if changes.fixed.length > 0}
			<h3>Fixed</h3>
			{#each changes.fixed as fix}
				<li>{fix}</li>
			{/each}
		{/if}

		{#if changes.security.length > 0}
			<h3>Security</h3>
			{#each changes.security as secure}
				<li>{secure}</li>
			{/each}
		{/if}
	</ul>
{/each}

<style lang="postcss">
  h1 {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 6rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-left: 2rem;
  }

  h3 {
    font-size: 1.25rem;
    margin-top: 1rem;
  }

  ul {
    margin-bottom: 1rem;
    margin-left: 4rem;
    @apply max-w-2xl;
  }

  li {
    margin-left: 4rem;
    list-style: circle;
    margin-top: 0.5rem;
  }
</style>