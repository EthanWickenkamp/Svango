// routes/itemedit/+page.server.ts   (identical content in routes/groups/)
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('access_token');            // JWT from HTTP-only cookie
	if (!token) {
		return { items: [] };             // unauthenticated – return empty list
	}

	const res = await fetch('http://backend:8000/api/items/', {
		headers: { Authorization: `Bearer ${token}` }
	});

	const items = res.ok ? await res.json() : [];
	return { items };
};