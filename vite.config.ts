import { defineConfig } from "vite"
import fs from "fs/promises"
import react from "@vitejs/plugin-react"
import eslint from "vite-plugin-eslint"

export default defineConfig(() => ({
	plugins: [react(), eslint()],
	esbuild: {
		loader: "jsx",
		include: /src\/.*\.jsx?$/,
		// loader: "tsx",
		// include: /src\/.*\.[tj]sx?$/,
		exclude: [],
	},
	build: {
		outDir: "build",
	},
	define: {
		"process.env": {}
	},
	optimizeDeps: {
		esbuildOptions: {
			loader: {".js" : "jsx"},
			plugins: [
				{
					name: "load-js-files-as-jsx",
					setup(build) {
						build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
							loader: "jsx",
							contents: await fs.readFile(args.path, "utf8"),
						}))
					},
				},
			],
		},
	},
	server: {
		proxy: {
			"/api": {
				target: "http://imp.cs.umu.se:80"
			},
			"/user": {
				target: "http://imp.cs.umu.se:80"
			},
		},
		port: 3000,
	},

}))
