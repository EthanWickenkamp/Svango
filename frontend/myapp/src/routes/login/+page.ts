import { writable } from 'svelte/store';

export const token = writable<string | null>(null);

export async function login(username: string, password: string) {
    try {
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Failed to log in');
        }

        const data = await response.json();
        token.set(data.access); // Store the access token
        localStorage.setItem('refreshToken', data.refresh); // Store the refresh token
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await fetch('http://localhost:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const data = await response.json();
        token.set(data.access); // Update the access token
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}