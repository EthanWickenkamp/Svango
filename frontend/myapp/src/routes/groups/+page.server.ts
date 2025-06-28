import { authenticatedFetch } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const [groupRes, ungroupedRes] = await Promise.all([
		authenticatedFetch('/api/groups/', event),
		authenticatedFetch('/api/items/?group=null', event)
	]);

	const groups = groupRes.ok ? await groupRes.json() : [];
	const ungrouped = ungroupedRes.ok ? await ungroupedRes.json() : [];

	return { groups, ungrouped };
};
