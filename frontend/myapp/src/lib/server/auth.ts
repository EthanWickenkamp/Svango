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
    
    // create header with token first
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    // attach the forwarded headers from hooks.server.ts
    for (const [key, value] of Object.entries(event.locals.forwardHeaders ?? {})) {
	headers.set(key, value);
    }
    // set path after backend and checking slash
    const apiPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${BACKEND_URL}${apiPath}`;
    
    // make fetch with options passed in function and set headers
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