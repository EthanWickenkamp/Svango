// src/routes/login/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { login } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	return {};
};



export const actions: Actions = {
    default: async (event) => {
        const { request } = event;
        const formData = await request.formData();
        const username = formData.get('username')?.toString() || '';
        const password = formData.get('password')?.toString() || '';

        return await login(username, password, event);
    }
};

