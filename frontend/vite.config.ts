import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/oncue-panel.ts"),
            name: "OnCuePanel",
            formats: ["iife"],
            fileName: () => "oncue-panel.js",
        },
        outDir: resolve(
            __dirname,
            "../custom_components/oncue/frontend"
        ),
        emptyOutDir: false,
        sourcemap: false,
        minify: true,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
            },
        },
    },
});
