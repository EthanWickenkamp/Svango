// src/routes/items/+page.server.ts
import { authenticatedFetch } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const res = await authenticatedFetch('/api/items/', event);
    
    if (!res.ok) {
        console.error("Item fetch failed with status:", res.status);
        return { items: [] };
    }
    
    const items = await res.json();
    return { items };
};