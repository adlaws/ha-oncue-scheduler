import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/ha-oncue-scheduler-panel.ts"),
            name: "HaOnCueSchedulerPanel",
            formats: ["iife"],
            fileName: () => "ha-oncue-scheduler-panel.js",
        },
        outDir: resolve(
            __dirname,
            "../custom_components/ha_oncue_scheduler/frontend"
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
