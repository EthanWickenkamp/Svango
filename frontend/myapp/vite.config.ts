import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	
	// Debug: log the environment variables
	console.log('VITE_ALLOWED_HOSTS:', env.VITE_ALLOWED_HOSTS);
	console.log('Parsed allowedHosts:', env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS.split(',') : 'undefined');
	
	return {
		plugins: [sveltekit()],
		server: {
			host: env.FRONTEND_HOST, // Allows access from Docker and other network interfaces
			port: parseInt(env.FRONTEND_PORT), // Default SvelteKit dev server port
			//allowedHosts: 'all', // Temporarily allow all hosts for testing
			allowedHosts: env.VITE_ALLOWED_HOSTS ? env.VITE_ALLOWED_HOSTS.split(',') : [], // Allowed hosts for security
			watch: {
				usePolling: false, // Necessary for file change detection in Docker
			},
			proxy: {
				'/api': {
					target: env.BACKEND_URL, // Django backend
					changeOrigin: true, // Needed for proxying cross-origin requests
					secure: false
				},
			},
		},
	};
});