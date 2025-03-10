<script lang="ts">
	// The data prop is injected from your load function.
	export let data;

	type Item = {
		id: number;
		name: string;
		description: string;
	};

	// Start with the items loaded from the API.
    // making local copies to edit and then send
	let items: Item[] = data.items;
	let newItem = { name: '', description: '' };
	let editItem: Item | null = null;

	// Re-fetch items from the API.
	async function fetchItems() {
		const res = await fetch('/api/items/');
		if (res.ok) {
			items = await res.json();
		} else {
			console.error('Failed to fetch items');
		}
	}

	// Create a new item via the API.
	async function addItem() {
		const res = await fetch('/api/items/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newItem)
		});
		if (res.ok) {
			newItem = { name: '', description: '' };
			fetchItems();
		} else {
			console.error('Error adding item');
		}
	}

	// Delete an item via the API.
	async function deleteItem(id: number) {
		const res = await fetch(`/api/items/${id}/`, { 
            method: 'DELETE' 
        });
		if (res.ok) {
			fetchItems();
		} else {
			console.error('Error deleting item');
		}
	}

	// Start editing an item (creates a copy so changes are not applied immediately).
	function startEdit(item: Item) {
		editItem = { ...item };
	}

	// Update an item via the API.
	async function updateItem() {
		if (!editItem) return;
		const res = await fetch(`/api/items/${editItem.id}/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: editItem.name,
				description: editItem.description
			})
		});
		if (res.ok) {
			editItem = null;
			fetchItems();
		} else {
			console.error('Error updating item');
		}
	}
</script>

<h1>Item List</h1>
{#if items.length > 0}
	<ul>
		{#each items as item (item.id)}
			<li>
				<strong>{item.name}</strong>: {item.description}
				<button on:click={() => deleteItem(item.id)}>Delete</button>
				<button on:click={() => startEdit(item)}>Edit</button>
			</li>
		{/each}
	</ul>
{:else}
	<p>No items available</p>
{/if}

<h2>Add Item</h2>
<form on:submit|preventDefault={addItem}>
	<input type="text" bind:value={newItem.name} placeholder="Name" required />
	<input type="text" bind:value={newItem.description} placeholder="Description" required />
	<button type="submit">Add</button>
</form>

{#if editItem}
	<h2>Edit Item</h2>
	<form on:submit|preventDefault={updateItem}>
		<input type="text" bind:value={editItem.name} placeholder="Name" required />
		<input type="text" bind:value={editItem.description} placeholder="Description" required />
		<button type="submit">Update</button>
		<button type="button" on:click={() => (editItem = null)}>Cancel</button>
	</form>
{/if}
