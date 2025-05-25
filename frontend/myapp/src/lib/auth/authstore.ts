import { writable, derived } from 'svelte/store';

export type User = {
	id: number;
	username: string;
	email: string;
};

export const token = writable<string | null>(null);
export const user = writable<User | null>(null);
export const isAuthenticated = derived(token, ($token) => !!$token);
