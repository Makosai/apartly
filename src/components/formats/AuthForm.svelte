<div class="auth-form">
	<slot />
</div>

<style lang="postcss">
	.auth-form {
		@apply bg-white p-8 rounded-3xl shadow-xl max-w-[500px] mx-auto;
    @apply flex flex-col justify-center items-center;
	}
</style>
