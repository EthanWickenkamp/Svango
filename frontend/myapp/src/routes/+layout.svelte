<script lang="ts">
	/* --- keep all your existing imports / markup --- */
	// receive the server-loaded user
	export let data: { user: { username: string } | null };

	const username = data.user?.username ?? null;

	// minimal logout helper: hit /logout + hard reload
	async function handleLogout() {
		await fetch('/logout');
		window.location.href = '/login';
	}
</script>

<nav>
	<div class="nav-left"><!-- your links stay untouched --></div>

	<div class="nav-right">
		{#if username}
			<span>Welcome, {username}</span>
			<button on:click={handleLogout}>Logout</button>
		{:else}
			<a href="/login">Login</a>
		{/if}
	</div>
</nav>

<slot />

<!-- keep your <style> block exactly as-is -->
