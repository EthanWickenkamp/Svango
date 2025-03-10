<script>
    export let data; // Store items fetched from the API
</script>

<h1>Item List</h1>

{#if data.items.length > 0}
    <ul>
        {#each data.items as item}
            <li>
                <strong>{item.name}</strong>: {item.description}
            </li>
        {/each}
    </ul>
{:else}
    <p>No items available</p>
{/if}