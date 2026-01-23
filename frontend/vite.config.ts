/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				index: "index.html",
				sw: "src/background.ts",
			},
			output: {
				entryFileNames: (chunk) =>
					chunk.name === "sw" ? "background.js" : "assets/[name]-[hash].js",
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
	},
});
