// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

// grabs every request and runs handle function on the event
export const handle: Handle = async ({ event, resolve }) => {
	// list of headers
	const headersToForward = [
		'X-Real-IP',
		'X-Forwarded-For',
		'X-Forwarded-Proto',
		'X-Forwarded-Host',
		'X-Forwarded-Server',
		'User-Agent',
		'Referer',
		'Origin',
	];

	const forwardHeaders: Record<string, string> = {};

	// if there is a value for each header, add it to forwardHeaders
	for (const header of headersToForward) {
		const value = event.request.headers.get(header);
		if (value) {
			forwardHeaders[header] = value;
		}
	}

	// Use forwarded host or fall back to original host
	forwardHeaders['Host'] =
		event.request.headers.get('X-Forwarded-Host') ??
		event.request.headers.get('Host') ??
		'';

	// Store in locals for proxy route
	event.locals.forwardHeaders = forwardHeaders;

	console.log('hooks.server.ts Forwarded Headers:', forwardHeaders);

	// Get access token from cookies
	const accessToken = event.cookies.get('access_token');
	
	// Store authentication state in locals
	event.locals.accessToken = accessToken;
	event.locals.isAuthenticated = !!accessToken;

	// IMPORTANT: Skip auth check for login/logout actions
	const isLoginAction = event.url.pathname === '/login' && event.request.method === 'POST';
	const isLogoutAction = event.url.pathname === '/logout';
	
	if (isLoginAction || isLogoutAction) {
		return resolve(event);
	}

	// Define protected routes (routes that require authentication)
	const protectedRoutes = ['/', '/dashboard', '/profile'];
	const isProtectedRoute = protectedRoutes.some(route => 
		event.url.pathname === route || event.url.pathname.startsWith(route + '/')
	);

	// Redirect to login if accessing protected route without token
	if (isProtectedRoute && !accessToken) {
		throw redirect(303, '/login');
	}

	// Redirect to home if already logged in and trying to access login page (GET only)
	if (event.url.pathname === '/login' && accessToken && event.request.method === 'GET') {
		throw redirect(303, '/');
	}

	return resolve(event);
	//resolve means proceed
};