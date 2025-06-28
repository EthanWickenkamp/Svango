<script lang="ts">
	/*  receive the user from +layout.server.ts  */
	export let data: { user: { username: string } | null };

	const username = data.user?.username ?? null;

	async function handleLogout() {
		await fetch('/logout');          // hits the cookie-clearing route
		window.location.href = '/';     // back to home
	}
</script>

<nav>
	<!--  UNCHANGED: your original list of links  -->
	<div class="nav-left">
		<ul>
			<li><a href="/">Home</a></li>
			<li><a href="/items">Items</a></li>
			<li><a href="/itemedit">Edit</a></li>
			<li><a href="/groups">Groups</a></li>
		</ul>
	</div>

	<!--  NEW block : appears at far right, but doesn’t disturb nav-left  -->
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

<style>
	/* keep or merge with your existing CSS */
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background-color: #f4f4f4;
	}

	.nav-left ul {
		display: flex;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-right {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
