import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

const BACKEND_URL = env.BACKEND_URL || 'http://backend:8000';

export async function authenticatedFetch(
    path: string,
    event: RequestEvent,
    options: RequestInit = {}
): Promise<Response> {
    const token = event.cookies.get('access_token');
    
    if (!token) {
        throw redirect(302, '/login');
    }
    
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    
    const apiPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${BACKEND_URL}${apiPath}`;
    
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