// src/routes/items/+page.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, fetch }) => {
	const token = cookies.get('access_token');

	if (!token) {
		throw redirect(302, '/login');
	}

	const res = await fetch('http://backend:8000/api/items/', {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});

	if (!res.ok) {
		console.error("Item fetch failed with status:", res.status);
		return { items: [] };
	}

	const items = await res.json();
	return { items };
};
