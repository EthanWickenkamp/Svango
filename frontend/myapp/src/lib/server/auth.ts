import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';

export async function authenticatedFetch(
    path: string,
    event: RequestEvent,
    options: RequestInit = {}
): Promise<Response> {
    const token = event.cookies.get('access_token');
    
    // cant go to page that calls authorized api fetch
    if (!token) {
        throw redirect(302, '/login');
    }
    
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);

    for (const [key, value] of Object.entries(event.locals.forwardHeaders ?? {})) {
	headers.set(key, value);
    }
    
    const apiPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${BACKEND_URL}${apiPath}`;
    
    // make fetch with options and headers
    const response = await fetch(url, {
        ...options,
        headers
    });
    

    // Handle token expiration
    if (response.status === 401) {
        event.cookies.delete('access_token', { path: '/' });
        throw redirect(302, '/login');
    }
    
    return response;
}