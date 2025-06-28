// src/routes/items/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('access_token');
	if (!token) {
		return { groups: [], ungrouped: [] };          // not logged in
	}

	// Call Django directly from the server, attaching the JWT
	const [groupRes, ungroupedRes] = await Promise.all([
		fetch('http://backend:8000/api/groups/', {
			headers: { Authorization: `Bearer ${token}` }
		}),
		fetch('http://backend:8000/api/items/?group=null', {
			headers: { Authorization: `Bearer ${token}` }
		})
	]);

	const groups     = groupRes.ok     ? await groupRes.json()     : [];
	const ungrouped  = ungroupedRes.ok ? await ungroupedRes.json() : [];

	return { groups, ungrouped };
};