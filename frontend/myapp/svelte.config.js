// svelte.config.js
import adapter from '@sveltejs/adapter-node';  // Changed from adapter-auto
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Build allowed origins from ALLOWED_HOSTS (HTTPS only for production)
const buildAllowedOrigins = () => {
	if (!process.env.ALLOWED_HOSTS) {
		return [];
	}
	
	const hosts = process.env.ALLOWED_HOSTS.split(',').map(h => h.trim());
	return hosts.map(host => `https://${host}`);
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter(),
		
		// CSRF Protection - Production ready
		csrf: {
			checkOrigin: true,  // Always check origin in production
			allowedOrigins: buildAllowedOrigins()
		}
	}
};

export default config;