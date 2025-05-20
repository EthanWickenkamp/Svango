// same as item/+page.ts is this loading same as .svelte page?
import type { PageLoad } from './$types';
import { authenticatedFetch } from '$lib/auth/authservice';

export const ssr = false;

export const load: PageLoad = async () => {
  try {
    const response = await authenticatedFetch('/api/items/');

    if (!response.ok) {
      throw new Error(`Failed to fetch items: ${response.status}`);
    }

    const items = await response.json();
    return { items };
  } catch (err) {
    console.error("Item fetch failed:", err);
    return { items: [] };
  }
};