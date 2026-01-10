// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess()],
	kit: {
		adapter: adapter(),
		csrf: {
			checkOrigin: false, 
		}
	}
};

export default config;

//using adapter-node to build a Node.js runtime application
// Node environment like a docker container
// Vite preprocess for TypeScript, PostCSS/SCSS, macros like $env
