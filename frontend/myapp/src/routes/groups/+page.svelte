<script lang="ts">
	export let data: {
		groups: any[];
		ungrouped: any[];
	};

	let groups = data.groups;
	let ungrouped = data.ungrouped;
	let draggedItem: any = null;

	function handleDragStart(event: DragEvent, item: any) {
		draggedItem = item;
		event.dataTransfer?.setData("text/plain", JSON.stringify(item));
	}

	function allowDrop(event: DragEvent) {
		event.preventDefault();
	}

	async function handleDrop(event: DragEvent, groupId: number | null) {
		event.preventDefault();
		if (!draggedItem) return;

		const itemId = draggedItem.id;

		// Optimistically update UI
		groups.forEach(group => {
			group.items = group.items.filter((i: any) => i.id !== itemId);
		});
		if (groupId === null) {
			ungrouped = [...ungrouped, draggedItem];
		} else {
			const group = groups.find((g: any) => g.id === groupId);
			if (group) {
				group.items = [...group.items, draggedItem];
			}
		}
		draggedItem.group = groupId;
		draggedItem = null;

		try {
			const res = await fetch(`/api/items/${itemId}/`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ group: groupId }),
				credentials: 'include'
			});
			if (!res.ok) console.error("Failed to update backend");
			await refreshGroups();
		} catch (error) {
			console.error("Error updating item:", error);
		}
	}

	async function refreshGroups() {
		try {
			const groupRes = await fetch('/api/groups/', { credentials: 'include' });
			const ungroupedRes = await fetch('/api/items/?group=null', { credentials: 'include' });

			if (!groupRes.ok || !ungroupedRes.ok) throw new Error("Failed to fetch data");

			groups = await groupRes.json();
			ungrouped = await ungroupedRes.json();
		} catch (error) {
			console.error("Refresh failed:", error);
		}
	}
</script>

<h1>Group Management</h1>

<div class="group-container">
	{#each groups as group}
		<div class="group" on:dragover={allowDrop} on:drop={(e) => handleDrop(e, group.id)}>
			<h2>{group.name}</h2>
			<ul>
				{#each group.items as item (item.id)}
					<li draggable="true" on:dragstart={(e) => handleDragStart(e, item)}>
						{item.name}
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>

<div class="ungrouped" on:dragover={allowDrop} on:drop={(e) => handleDrop(e, null)}>
	<h2>Ungrouped</h2>
	<ul>
		{#each ungrouped as item (item.id)}
			<li draggable="true" on:dragstart={(e) => handleDragStart(e, item)}>
				{item.name}
			</li>
		{/each}
	</ul>
</div>

<style>
	.group-container {
		display: flex;
		gap: 20px;
	}
	.group, .ungrouped {
		border: 2px solid #333;
		padding: 10px;
		min-width: 200px;
		background: #f4f4f4;
	}
	ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding-left: 0;
	}
	li {
		padding: 5px;
		background: lightgray;
		cursor: grab;
	}
</style>
