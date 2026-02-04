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
            "@components": path.resolve(__dirname, "./src/components"),
            "@pages": path.resolve(__dirname, "./src/pages"),
            "@data": path.resolve(__dirname, "./src/data"),
            "@src": path.resolve(__dirname, "./src"),
        },
    },
});

function reloadOnChangesInPublicDirectory(): PluginOption {
    return {
        name: "reload on changes in public directory",
        configureServer(server) {
            const { ws, watcher } = server;
            watcher.on("change", (file) => {
                if (file.startsWith(path.join(__dirname, "public"))) {
                    ws.send({
                        type: "full-reload",
                    });
                }
            });
        },
    }
}
