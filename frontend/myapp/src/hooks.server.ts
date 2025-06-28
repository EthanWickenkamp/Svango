// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // Capture headers from nginx for forwarding to Django
    const forwardHeaders: Record<string, string> = {};
    
    const headersToForward = [
        'X-Real-IP',
        'X-Forwarded-For', 
        'X-Forwarded-Proto',
        'X-Forwarded-Host',
        'X-Forwarded-Server',
        'User-Agent'
    ];

    headersToForward.forEach(header => {
        const value = event.request.headers.get(header);
        if (value) forwardHeaders[header] = value;
    });

    // Use forwarded host or fall back to original host
    forwardHeaders['Host'] = event.request.headers.get('X-Forwarded-Host') || 
                             event.request.headers.get('Host') || '';

    // Store in locals for proxy route
    event.locals.forwardHeaders = forwardHeaders;
    event.locals.djangoUrl = 'http://backend:8000'; // Internal docker network

    console.log('Forwarded Headers:', forwardHeaders);

    return resolve(event);
};