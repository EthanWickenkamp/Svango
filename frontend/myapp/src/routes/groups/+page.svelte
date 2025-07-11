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

    // Optimistically remove the item from all groups
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
        body: JSON.stringify({ group: groupId })
      });

      if (!res.ok) {
        console.error("Failed to update item group on backend");
      }

      await refreshGroups();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  }

  async function refreshGroups() {
    try {
      const groupRes = await fetch('/api/groups/');
      const ungroupedRes = await fetch('/api/items/?group=null');

      if (!groupRes.ok || !ungroupedRes.ok) {
        throw new Error("Failed to fetch groups or ungrouped items");
      }

      groups = await groupRes.json();
      ungrouped = await ungroupedRes.json();
    } catch (error) {
      console.error("Error refreshing groups:", error);
    }
  }
</script>

<h1>Group Management</h1>

<!-- Groups -->
<div class="group-container">
  {#each groups as group}
    <div 
      class="group"
      role="region"
      on:dragover={allowDrop} 
      on:drop={(e) => handleDrop(e, group.id)}
    >
      <h2>{group.name}</h2>
      <ul>
        {#each group.items as item (item.id)}
          <li 
            draggable="true" 
            on:dragstart={(e) => handleDragStart(e, item)}
          >
            {item.name}
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<!-- Ungrouped Items -->
<div 
  class="ungrouped"
  role="region"
  on:dragover={allowDrop} 
  on:drop={(e) => handleDrop(e, null)}
>
  <h2>Ungrouped</h2>
  <ul>
    {#each ungrouped as item (item.id)}
      <li 
        draggable="true" 
        on:dragstart={(e) => handleDragStart(e, item)}
      >
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

  .group ul, .ungrouped ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 0;
    margin: 0;
  }

  li {
    padding: 5px;
    background: lightgray;
    cursor: grab;
    width: 100%;
    max-width: 200px;
    box-sizing: border-box;
  }
</style>
