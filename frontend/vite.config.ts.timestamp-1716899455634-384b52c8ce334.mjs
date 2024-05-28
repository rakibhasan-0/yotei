// vite.config.ts
import { defineConfig, loadEnv } from "file:///mnt/c/Users/Hanne/Uni/PVT/yotei/frontend/node_modules/vite/dist/node/index.js";
import * as fs from "fs/promises";
import react from "file:///mnt/c/Users/Hanne/Uni/PVT/yotei/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.jsx?$/,
      // loader: "tsx",
      // include: /src\/.*\.[tj]sx?$/,
      exclude: []
    },
    build: {
      outDir: "build"
    },
    define: {
      "process.env": {}
    },
    optimizeDeps: {
      esbuildOptions: {
        loader: { ".js": "jsx" },
        plugins: [
          {
            name: "load-js-files-as-jsx",
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: "jsx",
                contents: await fs.readFile(args.path, "utf8")
              }));
            }
          }
        ]
      }
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:" + env.GATEWAY_PORT
        },
        "/user": {
          target: "http://localhost:" + env.GATEWAY_PORT
        }
      },
      port: env.FRONTEND_PORT
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvSGFubmUvVW5pL1BWVC95b3RlaS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL0hhbm5lL1VuaS9QVlQveW90ZWkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL0hhbm5lL1VuaS9QVlQveW90ZWkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiXHJcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmcy9wcm9taXNlc1wiXHJcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIlxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpXSxcclxuICAgIGVzYnVpbGQ6IHtcclxuICAgICAgbG9hZGVyOiAnanN4JyxcclxuICAgICAgaW5jbHVkZTogL3NyY1xcLy4qXFwuanN4PyQvLFxyXG4gICAgICAvLyBsb2FkZXI6IFwidHN4XCIsXHJcbiAgICAgIC8vIGluY2x1ZGU6IC9zcmNcXC8uKlxcLlt0al1zeD8kLyxcclxuICAgICAgZXhjbHVkZTogW10sXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgb3V0RGlyOiAnYnVpbGQnLFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICAncHJvY2Vzcy5lbnYnOiB7fSxcclxuICAgIH0sXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgZXNidWlsZE9wdGlvbnM6IHtcclxuICAgICAgICBsb2FkZXI6IHsgJy5qcyc6ICdqc3gnIH0sXHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnbG9hZC1qcy1maWxlcy1hcy1qc3gnLFxyXG4gICAgICAgICAgICBzZXR1cChidWlsZCkge1xyXG4gICAgICAgICAgICAgIGJ1aWxkLm9uTG9hZCh7IGZpbHRlcjogL3NyY1xcLy4qXFwuanMkLyB9LCBhc3luYyAoYXJncykgPT4gKHtcclxuICAgICAgICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXHJcbiAgICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxyXG4gICAgICAgICAgICAgIH0pKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6XCIgKyBlbnYuR0FURVdBWV9QT1JULFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy91c2VyJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6XCIgKyBlbnYuR0FURVdBWV9QT1JULFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIHBvcnQ6IGVudi5GUk9OVEVORF9QT1JULFxyXG4gICAgfSxcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxjQUFjLGVBQWU7QUFDblYsWUFBWSxRQUFRO0FBQ3BCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNQLFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQTtBQUFBO0FBQUEsTUFHVCxTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sZUFBZSxDQUFDO0FBQUEsSUFDbEI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUSxFQUFFLE9BQU8sTUFBTTtBQUFBLFFBQ3ZCLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNLE9BQU87QUFDWCxvQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsZ0JBQ3hELFFBQVE7QUFBQSxnQkFDUixVQUFVLE1BQVMsWUFBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLGNBQy9DLEVBQUU7QUFBQSxZQUNKO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxzQkFBc0IsSUFBSTtBQUFBLFFBQ3BDO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxRQUFRLHNCQUFzQixJQUFJO0FBQUEsUUFDcEM7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
