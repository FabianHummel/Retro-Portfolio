import {defineConfig, PluginOption} from 'vite';
import solidPlugin from 'vite-plugin-solid';
import wasm from 'vite-plugin-wasm';
import path from 'path';
import fs from 'fs';
import {Entry} from "@data/Book";

function addRecursively(result: any, target: string) {
	fs.readdirSync(path.resolve(__dirname, './public/book/', target)).forEach((file) => {
		if (fs.lstatSync(path.resolve(__dirname, './public/book/', target, file)).isDirectory()) {
			if (!result[file]) {
				result[file] = {};
			}
			result[file].children = addRecursively({}, file + '/');
		}

		if (file.endsWith(".md") && file !== '404.md') {
			const firstLine = fs.readFileSync(path.resolve(__dirname, './public/book/', target, file), 'utf-8').split('\n')[0];
			const VITE_GENERATION_INDEX = firstLine.match(/VITE_GENERATION_INDEX: (\d+)/)?.[1] || -1;
			console.log(file, VITE_GENERATION_INDEX);

			const folder = file.replace(/\.md$/, '');
			if (!result[folder]) {
				result[folder] = {};
			}
			result[folder].path = target + file;
			result[folder].VITE_GENERATION_INDEX = VITE_GENERATION_INDEX;
		}
	});

	return Object.entries(result).reduce((acc, [key, value]) => {
		acc.push({
			title: key,
			...value as Entry,
		});
		return acc;
	}, []).sort((a, b) => a.VITE_GENERATION_INDEX - b.VITE_GENERATION_INDEX);
}

function generateBookData(): PluginOption {
	return ({
		name: 'generate-book-data',
		transform(code, id) {
			const cwd = process.cwd();
			const relativePath = id.replace(cwd, '');
			if (relativePath === '/src/generated/book-entries.ts') {
				const result = addRecursively({}, '');
				return {
					code: code.replace(/"VITE_GENERATE"/, JSON.stringify(result)),
				}
			}
		}
	});
}

export default defineConfig({
	plugins: [solidPlugin(), wasm(), generateBookData()],
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