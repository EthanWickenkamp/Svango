// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { authenticatedFetch } from '$lib/server/auth';

export const load: LayoutServerLoad = async (event) => {
    const accessToken = event.cookies.get('access_token');
    
    // Only fetch user if we have a token
    if (!accessToken) {
        return {
            user: null,
            isAuthenticated: false
        };
    }
    
    try {
        const response = await authenticatedFetch('/api/user-profile/', event);
        
        if (response.ok) {
            const user = await response.json();
            return {
                user,
                isAuthenticated: true
            };
        }
    } catch (error) {
        // If authenticatedFetch redirects, it will throw
        // Just return null user
    }
    
    return {
        user: null,
        isAuthenticated: false
    };
};