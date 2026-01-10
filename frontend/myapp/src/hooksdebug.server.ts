// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
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

	for (const header of headersToForward) {
		const value = event.request.headers.get(header);
		if (value) {
			forwardHeaders[header] = value;
		}
	}

	forwardHeaders['Host'] =
		event.request.headers.get('X-Forwarded-Host') ??
		event.request.headers.get('Host') ??
		'';

	event.locals.forwardHeaders = forwardHeaders;

	console.log('hooks.server.ts Forwarded Headers:', forwardHeaders);

	// Get access token from cookies
	const accessToken = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');
	
	// 🔍 DEBUG: Log everything about this request
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
	console.log('🔍 REQUEST:', {
		path: event.url.pathname,
		method: event.request.method,
		hasAccessToken: !!accessToken,
		hasRefreshToken: !!refreshToken,
		accessTokenLength: accessToken?.length || 0
	});
	console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

	// Store authentication state in locals
	event.locals.accessToken = accessToken;
	event.locals.isAuthenticated = !!accessToken;

	// Skip auth check for login/logout actions
	const isLoginAction = event.url.pathname === '/login' && event.request.method === 'POST';
	const isLogoutAction = event.url.pathname === '/logout';
	
	if (isLoginAction) {
		console.log('⏭️  LOGIN ACTION - skipping auth checks');
		return resolve(event);
	}
	
	if (isLogoutAction) {
		console.log('⏭️  LOGOUT ACTION - skipping auth checks');
		return resolve(event);
	}

	// Define protected routes
	const protectedRoutes = ['/', '/dashboard', '/profile'];
	const isProtectedRoute = protectedRoutes.some(route => 
		event.url.pathname === route || event.url.pathname.startsWith(route + '/')
	);

	// Check if trying to access protected route without token
	if (isProtectedRoute && !accessToken) {
		console.log('🚫 Protected route without token - redirecting to /login');
		throw redirect(303, '/login');
	}

	// If logged in and trying to access login page (GET only), redirect to home
	if (event.url.pathname === '/login' && accessToken && event.request.method === 'GET') {
		console.log('✅ Already logged in, redirecting from /login to /');
		throw redirect(303, '/');
	}

	console.log('✅ Auth check passed');
	return resolve(event);
};