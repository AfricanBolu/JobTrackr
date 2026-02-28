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
				content: "src/content.ts",
			},
			output: {
				entryFileNames: (chunk) => {
					// 2. Ensure both sw and content don't get hashes
					if (chunk.name === "sw") return "background.js";
					if (chunk.name === "content") return "content.js";
					return "assets/[name]-[hash].js";
				},
				assetFileNames: "assets/[name]-[hash][extname]",
			},
		},
	},
});
