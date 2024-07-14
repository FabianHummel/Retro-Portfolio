import {defineConfig, PluginOption} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import wasm from 'vite-plugin-wasm';
import path from 'path';
import fs from 'fs';

export default defineConfig({
	plugins: [solidPlugin(), wasm()],
	server: {
		port: 3000,
	},
	build: {
		target: 'esnext',
	},
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "./src/components"),
			"@pages": path.resolve(__dirname, "./src/pages"),
			"@data": path.resolve(__dirname, "./src/data"),
			"@src": path.resolve(__dirname, "./src"),
		},
	},
});