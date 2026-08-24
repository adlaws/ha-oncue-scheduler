import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    root: resolve(__dirname, "dev"),
    server: {
        port: 5173,
        open: true,
    },
});
