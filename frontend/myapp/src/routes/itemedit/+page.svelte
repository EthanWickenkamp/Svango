<script lang="ts">
	import { authenticatedFetch } from '$lib/client/auth'; // ✅ new import
	import { onMount } from 'svelte';
	export let data;

	type Item = {
		id: number;
		name: string;
		description: string;
	};

	let items: Item[] = data.items;
	let newItem = { name: '', description: '' };
	let editItem: Item | null = null;

	// Simple wrapper to refetch via server (SSR)
	async function refreshItems() {
		const res = await fetch('/items'); // Triggers +page.server.ts
		const html = await res.text();
		document.open();
		document.write(html);
		document.close();
	}

	async function addItem() {
		const res = await authenticatedFetch('/items/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newItem)
		});
		if (res.ok) {
			newItem = { name: '', description: '' };
			await refreshItems();
		} else {
			console.error('Error adding item');
		}
	}

	async function deleteItem(id: number) {
		const res = await authenticatedFetch(`/items/${id}/`, {
			method: 'DELETE'
		});
		if (res.ok) {
			await refreshItems();
		} else {
			console.error('Error deleting item');
		}
	}

	function startEdit(item: Item) {
		editItem = { ...item };
	}

	async function updateItem() {
		if (!editItem) return;
		const res = await authenticatedFetch(`/items/${editItem.id}/`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: editItem.name,
				description: editItem.description
			})
		});
		if (res.ok) {
			editItem = null;
			await refreshItems();
		} else {
			console.error('Error updating item');
		}
	}
</script>

