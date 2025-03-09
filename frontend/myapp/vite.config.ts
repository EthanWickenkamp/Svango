import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
        host: '0.0.0.0', // Allows access from Docker and other network interfaces
        port: 5173,      // Default SvelteKit dev server port
		watch: {
			usePolling: true, // Necessary for file change detection in Docker
		},
        proxy: {
            '/api': {
                target: 'http://backend:8000', // Django backend
                changeOrigin: true,             // Needed for proxying cross-origin requests
                secure: false
            },
        },
    },



});
