import { authenticatedFetch } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const res = await authenticatedFetch('/api/items/', event);

	return {
		items: res.ok ? await res.json() : []
	};
};
