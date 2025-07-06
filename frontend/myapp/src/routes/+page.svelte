<script lang="ts">
	export let data;
	const username = data.user?.username;
</script>

<h1>Welcome {username ? `${username} ` : ''}to Svango template</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<style>
	main {
		font-family: system-ui, sans-serif;
		color: #333;
		padding: 1.5rem;
	}
	h1 {
		font-size: 4rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}
	p {
		font-size: 0.95rem;
		color: #555;
	}
	a {
		color: #2e3144;
		text-decoration: none;
	}
</style>