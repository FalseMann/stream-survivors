import {defineConfig} from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	build: {
		target: 'esnext',
	},
	plugins: [solid()],
	preview: {
		host: true,
		port: 8080,
	},
	server: {
		port: 3000,
		host: true,
	},
});
