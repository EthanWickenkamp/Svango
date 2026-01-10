// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			accessToken?: string;
			isAuthenticated: boolean;
			forwardHeaders?: Record<string, string>;
		}
		interface PageData {
			isAuthenticated?: boolean;
		}
	}
}

export {};
