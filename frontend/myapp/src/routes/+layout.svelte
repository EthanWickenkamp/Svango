<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchUserProfile, logout } from '$lib/auth/authservice';

	let username: string | null = null;

	onMount(async () => {
		const user = await fetchUserProfile();
		username = user?.username ?? null;
	});

	async function handleLogout() {
		await logout();
		window.location.href = '/login';
	}
</script>

<nav>
  <div class="nav-left">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/items">Items</a></li>
      <li><a href="/itemedit">Edit</a></li>
      <li><a href="/groups">Groups</a></li>
    </ul>
  </div>

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
  nav {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background-color: #f4f4f4;
  }

  .nav-left ul {
    list-style: none;
    display: flex;
    gap: 1rem;
    padding: 0;
    margin: 0;
  }

  .nav-left li {
    display: inline;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
