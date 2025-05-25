import { token, user } from './authstore';
import { get } from 'svelte/store';

type TokenResponse = {
	access: string;
};

type UserResponse = {
	id: number;
	username: string;
	email: string;
};

export async function login(username: string, password: string): Promise<boolean> {
	try {
		const res = await fetch('/api/token/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (!res.ok) throw new Error('Login failed');
		const data: TokenResponse = await res.json(); //assumes res.json matches TokenResponse

		token.set(data.access);
    if (!data.access) throw new Error("Malformed token response");
		await fetchUserProfile();

		return true;
	} catch (error) {
		console.error('Login error:', error);
		logout();
		return false;
	}
}

export async function fetchUserProfile(): Promise<UserResponse | null> {
	try {
		const res = await fetch('/api/user-profile/', {
			headers: { Authorization: `Bearer ${get(token)}` } //announce bearer token and use get to update token store value
		});

		if (!res.ok) throw new Error('Failed to fetch user profile');

		const userData: UserResponse = await res.json();
		user.set(userData);
		return userData;
	} catch (error) {
		console.error('User fetch error:', error);
		user.set(null);
		return null;
	}
}

export async function logout(): Promise<void> {
	token.set(null);
	user.set(null);
}

export async function authenticatedFetch(
	url: string,
	options: RequestInit = {}
): Promise<Response> {
	const accessToken = get(token);
	if (!accessToken) {
		throw new Error('No access token available');
	}

	const headers = {
		...options.headers,
		Authorization: `Bearer ${accessToken}`
	};

	return fetch(url, {
		...options,
		headers
	});
}
