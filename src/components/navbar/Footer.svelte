<script lang="ts">
	import { loadIcons } from '@iconify/svelte';
	import Icon from '@iconify/svelte';
	import { sitename } from '$lib/info';

	loadIcons(['akar-icons:twitter-fill', 'akar-icons:facebook-fill', 'akar-icons:instagram-fill', 'akar-icons:linkedin-fill']);
</script>

<footer class="footer">
	<!-- Twitter -->
	<div class="socials">
		<a href="./#"><Icon icon="akar-icons:twitter-fill" width="22" height="22" /></a>
		<a href="./#"><Icon icon="akar-icons:facebook-fill" width="22" height="22" /></a>
		<a href="./#"><Icon icon="akar-icons:instagram-fill" width="22" height="22" /></a>
		<a href="./#"><Icon icon="akar-icons:linkedin-fill" width="22" height="22" /></a>
	</div>
	<p>Copyright &copy; 2024 {sitename}</p>
</footer>

<style lang="postcss">
	.footer {
		@apply bg-gray-800 text-white text-center py-4;
		@apply w-full;
		@apply fixed bottom-0;
	}

	.socials {
		@apply flex gap-4 justify-center items-center mb-4 mt-2;
	}
</style>
