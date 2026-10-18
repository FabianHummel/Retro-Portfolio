import path from 'path';
import { defineConfig, type PluginOption } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
    plugins: [
        solidPlugin(),
        wasm(),
        reloadOnChangesInPublicDirectory(),
    ],
    server: {
        port: 3000,
    },
    build: {
        target: 'esnext',
    },
    resolve: {
        alias: {
            "@components": path.resolve(import.meta.dirname, "./src/components"),
            "@pages": path.resolve(import.meta.dirname, "./src/pages"),
            "@data": path.resolve(import.meta.dirname, "./src/data"),
            "@src": path.resolve(import.meta.dirname, "./src"),
        },
    },
});

function reloadOnChangesInPublicDirectory(): PluginOption {
    return {
        name: "reload on changes in public directory",
        configureServer(server) {
            const { ws, watcher } = server;
            watcher.on("change", (file) => {
                if (file.startsWith(path.join(import.meta.dirname, "public"))) {
                    ws.send({
                        type: "full-reload",
                    });
                }
            });
        },
    }
}
