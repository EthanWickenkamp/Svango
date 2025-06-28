// src/lib/auth/authservice.ts

type UserResponse = {
	id: number;
	username: string;
	email: string;
};

// For client-side components that want to hydrate the user
export async function fetchUserProfile(): Promise<UserResponse | null> {
	try {
		const res = await fetch('/api/user/', {
			credentials: 'include'
		});
		if (!res.ok) throw new Error('User fetch failed');

		const userData: UserResponse = await res.json();
		return userData;
	} catch (err) {
		console.error('User fetch error:', err);
		return null;
	}
}

// Client-side logout trigger (calls SSR logout route)
export async function logout(): Promise<void> {
	await fetch('/logout', {
		method: 'GET',
		credentials: 'include'
	});
}
