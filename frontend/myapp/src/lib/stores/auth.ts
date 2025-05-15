import { writable } from 'svelte/store';

export const token = writable<string | null>(null);

export async function login(username: string, password: string) {
    const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    token.set(data.access);
    localStorage.setItem('refreshToken', data.refresh);
}
