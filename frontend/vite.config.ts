import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/oncue-scheduler-panel.ts"),
            name: "HaOnCueSchedulerPanel",
            formats: ["iife"],
            fileName: () => "oncue-scheduler-panel.js",
        },
        outDir: resolve(
            __dirname,
            "../custom_components/oncue_scheduler/frontend"
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
