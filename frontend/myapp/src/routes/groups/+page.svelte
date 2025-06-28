<script lang="ts">
  import { authenticatedFetch } from '$lib/client/auth';

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
      const res = await authenticatedFetch(`/items/${itemId}/`, {
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
      const groupRes = await authenticatedFetch('/groups/');
      const ungroupedRes = await authenticatedFetch('/items/?group=null');

      if (!groupRes.ok) throw new Error("Failed to fetch groups");
      if (!ungroupedRes.ok) throw new Error("Failed to fetch ungrouped items");

      const fetchedGroups = await groupRes.json();
      const fetchedUngrouped = await ungroupedRes.json();

      groups = fetchedGroups;
      ungrouped = fetchedUngrouped;
    } catch (error) {
      console.error("Error refreshing groups:", error);
    }
  }
</script>
