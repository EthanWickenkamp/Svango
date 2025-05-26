<script lang="ts">
  import { isAuthenticated } from '$lib/auth/authstore';
  export let data: {
    items: { name: string; description: string }[];
  };
</script>

{#if $isAuthenticated}
	<h1>Item List</h1>

	{#if data.items.length > 0}
		<ul>
			{#each data.items as item}
				<li><strong>{item.name}</strong>: {item.description}</li>
			{/each}
		</ul>
	{/if}
{:else}
	<h1>You are not logged in</h1>
{/if}
