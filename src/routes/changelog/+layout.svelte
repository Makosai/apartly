<a href="/">Home page</a>

<main>
	<slot />
</main>

<style lang="postcss">
	a {
		color: var(--soft-blue);
		text-decoration: underline;
		margin-left: 1rem;
	}

	a:hover {
		opacity: 0.8;
	}

  main {
    margin: 0 auto;
    max-width: 800px;
    padding: 2rem;
  }
</style>
