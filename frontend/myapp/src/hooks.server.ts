// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { BACKEND_URL } from '$env/static/private';


export const handle: Handle = async ({ event, resolve }) => {
	const headersToForward = [
		'X-Real-IP',
		'X-Forwarded-For',
		'X-Forwarded-Proto',
		'X-Forwarded-Host',
		'X-Forwarded-Server',
		'User-Agent'
	];

	const forwardHeaders: Record<string, string> = {};

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
	event.locals.djangoUrl = BACKEND_URL;

    console.log('hooks.server.ts Forwarded Headers:', forwardHeaders);

    return resolve(event);
};