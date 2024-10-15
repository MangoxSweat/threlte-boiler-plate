import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	server: {
		proxy: {
			// Example: Proxy API requests starting with /api to a backend running on localhost:5000
		},
		https: true // Enable HTTPS as you're using mkcert for SSL
	},
	plugins: [
		mkcert(),
		glsl({
			include: '**/*.glsl' // Include all GLSL files in the project
		}),
		sveltekit()
	]
});
