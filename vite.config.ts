import { defineConfig, loadEnv } from "vite"
import * as fs from "fs/promises"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      // loader: "tsx",
      // include: /src\/.*\.[tj]sx?$/,
      exclude: [],
    },
    build: {
      outDir: 'build',
    },
    define: {
      'process.env': {},
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { '.js': 'jsx' },
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: 'jsx',
                contents: await fs.readFile(args.path, 'utf8'),
              }))
            },
          },
        ],
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.USE_IMP_SERVER === "true" ? 'http://imp.cs.umu.se:80' : "http://localhost:" + env.GATEWAY_PORT,
        },
        '/user': {
          target: env.USE_IMP_SERVER === "true" ? 'http://imp.cs.umu.se:80' : "http://localhost:" + env.GATEWAY_PORT,
        },
      },
      port: env.FRONTEND_PORT,
    },
  }
})
