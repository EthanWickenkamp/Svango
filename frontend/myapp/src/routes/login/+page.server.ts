// src/routes/login/+page.server.ts
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { BACKEND_URL } from '$env/static/private';
import { NODE_ENV } from '$env/static/private';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() || '';
		const password = formData.get('password')?.toString() || '';

		// Backend login endpoint
		const res = await fetch(`${BACKEND_URL}/api/token/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (!res.ok) {
			return fail(401, {
				error: 'Invalid username or password',
				values: { username }
			});
		}

		const data = await res.json();

		// Set secure cookie
		cookies.set('access_token', data.access, {
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: NODE_ENV === 'production',
			maxAge: 60 * 60 // 1 hour
		});

		throw redirect(302, '/');
	}
};

