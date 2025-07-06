// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

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

    return resolve(event);
	//resolve means proceed
};