import { authenticatedFetch } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	try {
		// current-user endpoint (adjust the path if yours differs)
		const res = await authenticatedFetch('/api/user-profile/', event);

		if (!res.ok) return { user: null };

		const user = await res.json();
		return { user };
	} catch {
		// not logged in (throws redirect if no cookie)
		return { user: null };
	}
};