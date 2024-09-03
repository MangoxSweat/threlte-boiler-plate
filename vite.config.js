import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
	plugins: [
		mkcert(),
		glsl({
			include: '**/*.glsl' // Include all GLSL files in the project
		}),
		sveltekit()
	]
});
