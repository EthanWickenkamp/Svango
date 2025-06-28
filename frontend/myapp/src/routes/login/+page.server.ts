// src/routes/login/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() || '';
		const password = formData.get('password')?.toString() || '';

		const res = await fetch('http://backend:8000/api/token/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (!res.ok) {
			return fail(401, { error: 'Invalid username or password' });
		}

		const data = await res.json();
		cookies.set('access_token', data.access, {
			httpOnly: true,
			path: '/',
			sameSite: 'strict',
			secure: false // set to true in production!
		});

		throw redirect(302, '/');
	}
};
