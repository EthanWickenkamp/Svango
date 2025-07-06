import { redirect, fail } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { BACKEND_URL, NODE_ENV } from '$env/static/private';

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

export async function login(
    username: string,
    password: string,
    event: RequestEvent
) {
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
    event.cookies.set('access_token', data.access, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: NODE_ENV === 'production',
        maxAge: 60 * 60 // 1 hour
    });

    throw redirect(302, '/');
}

export async function logout(event: RequestEvent) {
    event.cookies.delete('access_token', { path: '/' });   // clear JWT cookie
    throw redirect(302, '/');                              // send user to homepage
}