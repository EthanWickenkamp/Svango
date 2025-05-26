// src/routes/items/+page.ts
import type { PageLoad } from './$types';
import { authenticatedFetch } from '$lib/auth/authservice';

export const ssr = false;

export const load: PageLoad = async () => {
  try {
    const groupRes = await authenticatedFetch('/api/groups/');
    const ungroupedRes = await authenticatedFetch('/api/items/?group=null');

    if (!groupRes.ok) throw new Error(`Failed to fetch groups: ${groupRes.status}`);
    if (!ungroupedRes.ok) throw new Error(`Failed to fetch ungrouped: ${ungroupedRes.status}`);

    const groups = await groupRes.json();
    const ungrouped = await ungroupedRes.json();

    return { groups, ungrouped };
  } catch (err) {
    console.error("Data fetch failed:", err);
    return { groups: [], ungrouped: [] };
  }
};
