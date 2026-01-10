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
        throw redirect(303, '/login'); // Changed from 302
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
    
    // Handle token expiration - try refresh first
    if (response.status === 401) {
        const refreshSuccess = await refreshTokens(event);
        if (refreshSuccess) {
            // Retry original request with new access token
            const newToken = event.cookies.get('access_token');
            headers.set('Authorization', `Bearer ${newToken}`);
            return await fetch(url, {
                ...options,
                headers
            });
        } else {
            // Refresh failed, redirect to login
            event.cookies.delete('access_token', { path: '/' });
            event.cookies.delete('refresh_token', { path: '/' });
            throw redirect(303, '/login'); // Changed from 302
        }
    }
    
    return response;
}

async function refreshTokens(event: RequestEvent): Promise<boolean> {
    const refreshToken = event.cookies.get('refresh_token');
    
    if (!refreshToken) {
        return false;
    }
    
    try {
        const res = await fetch(`${BACKEND_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refreshToken })
        });
        
        if (!res.ok) {
            return false;
        }
        
        const data = await res.json();
        
        // Update access token cookie
        event.cookies.set('access_token', data.access, {
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: false, //change for production
            maxAge: 60 * 60 // 1 hour
        });
        
        return true;
    } catch (error) {
        return false;
    }
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

    // Set secure cookies for both tokens
    event.cookies.set('access_token', data.access, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false, //change for production
        maxAge: 60 * 60 // 1 hour
    });
    
    event.cookies.set('refresh_token', data.refresh, {
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: false, //change for production
        maxAge: 24 * 60 * 60 // 1 day
    });

    throw redirect(303, '/'); // Changed from 302
}

export async function logout(event: RequestEvent) {
    const refreshToken = event.cookies.get('refresh_token');
    
    // Call blacklist API if we have a refresh token
    if (refreshToken) {
        try {
            await fetch(`${BACKEND_URL}/api/token/blacklist/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: refreshToken })
            });
            // Don't check response - just try to blacklist, but continue regardless
        } catch (error) {
            // Ignore blacklist errors - still logout on frontend
            console.log('⚠️  Blacklist failed, but continuing logout');
        }
    }
    
    // Clear both cookies
    event.cookies.delete('access_token', { path: '/' });
    event.cookies.delete('refresh_token', { path: '/' });
    
    console.log('🚪 Logged out, redirecting to /');
    throw redirect(303, '/');
}