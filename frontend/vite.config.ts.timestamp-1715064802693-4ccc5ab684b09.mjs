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
          target: env.USE_IMP_SERVER === "true" ? "http://imp.cs.umu.se:80" : "http://localhost:" + env.GATEWAY_PORT
        },
        "/user": {
          target: env.USE_IMP_SERVER === "true" ? "http://imp.cs.umu.se:80" : "http://localhost:" + env.GATEWAY_PORT
        }
      },
      port: env.FRONTEND_PORT
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbW50L2MvVXNlcnMvSGFubmUvVW5pL1BWVC95b3RlaS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21udC9jL1VzZXJzL0hhbm5lL1VuaS9QVlQveW90ZWkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21udC9jL1VzZXJzL0hhbm5lL1VuaS9QVlQveW90ZWkvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tIFwidml0ZVwiXG5pbXBvcnQgKiBhcyBmcyBmcm9tIFwiZnMvcHJvbWlzZXNcIlxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcbiAgY29uc3QgZW52ID0gbG9hZEVudihtb2RlLCBwcm9jZXNzLmN3ZCgpLCAnJylcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gICAgZXNidWlsZDoge1xuICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgIGluY2x1ZGU6IC9zcmNcXC8uKlxcLmpzeD8kLyxcbiAgICAgIC8vIGxvYWRlcjogXCJ0c3hcIixcbiAgICAgIC8vIGluY2x1ZGU6IC9zcmNcXC8uKlxcLlt0al1zeD8kLyxcbiAgICAgIGV4Y2x1ZGU6IFtdLFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIG91dERpcjogJ2J1aWxkJyxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgJ3Byb2Nlc3MuZW52Jzoge30sXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGVzYnVpbGRPcHRpb25zOiB7XG4gICAgICAgIGxvYWRlcjogeyAnLmpzJzogJ2pzeCcgfSxcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdsb2FkLWpzLWZpbGVzLWFzLWpzeCcsXG4gICAgICAgICAgICBzZXR1cChidWlsZCkge1xuICAgICAgICAgICAgICBidWlsZC5vbkxvYWQoeyBmaWx0ZXI6IC9zcmNcXC8uKlxcLmpzJC8gfSwgYXN5bmMgKGFyZ3MpID0+ICh7XG4gICAgICAgICAgICAgICAgbG9hZGVyOiAnanN4JyxcbiAgICAgICAgICAgICAgICBjb250ZW50czogYXdhaXQgZnMucmVhZEZpbGUoYXJncy5wYXRoLCAndXRmOCcpLFxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIHByb3h5OiB7XG4gICAgICAgICcvYXBpJzoge1xuICAgICAgICAgIHRhcmdldDogZW52LlVTRV9JTVBfU0VSVkVSID09PSBcInRydWVcIiA/ICdodHRwOi8vaW1wLmNzLnVtdS5zZTo4MCcgOiBcImh0dHA6Ly9sb2NhbGhvc3Q6XCIgKyBlbnYuR0FURVdBWV9QT1JULFxuICAgICAgICB9LFxuICAgICAgICAnL3VzZXInOiB7XG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVVNFX0lNUF9TRVJWRVIgPT09IFwidHJ1ZVwiID8gJ2h0dHA6Ly9pbXAuY3MudW11LnNlOjgwJyA6IFwiaHR0cDovL2xvY2FsaG9zdDpcIiArIGVudi5HQVRFV0FZX1BPUlQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcG9ydDogZW52LkZST05URU5EX1BPUlQsXG4gICAgfSxcbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxjQUFjLGVBQWU7QUFDblYsWUFBWSxRQUFRO0FBQ3BCLE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssTUFBTTtBQUN4QyxRQUFNLE1BQU0sUUFBUSxNQUFNLFFBQVEsSUFBSSxHQUFHLEVBQUU7QUFDM0MsU0FBTztBQUFBLElBQ0wsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLElBQ2pCLFNBQVM7QUFBQSxNQUNQLFFBQVE7QUFBQSxNQUNSLFNBQVM7QUFBQTtBQUFBO0FBQUEsTUFHVCxTQUFTLENBQUM7QUFBQSxJQUNaO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsSUFDVjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sZUFBZSxDQUFDO0FBQUEsSUFDbEI7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLGdCQUFnQjtBQUFBLFFBQ2QsUUFBUSxFQUFFLE9BQU8sTUFBTTtBQUFBLFFBQ3ZCLFNBQVM7QUFBQSxVQUNQO0FBQUEsWUFDRSxNQUFNO0FBQUEsWUFDTixNQUFNLE9BQU87QUFDWCxvQkFBTSxPQUFPLEVBQUUsUUFBUSxlQUFlLEdBQUcsT0FBTyxVQUFVO0FBQUEsZ0JBQ3hELFFBQVE7QUFBQSxnQkFDUixVQUFVLE1BQVMsWUFBUyxLQUFLLE1BQU0sTUFBTTtBQUFBLGNBQy9DLEVBQUU7QUFBQSxZQUNKO0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJLG1CQUFtQixTQUFTLDRCQUE0QixzQkFBc0IsSUFBSTtBQUFBLFFBQ2hHO0FBQUEsUUFDQSxTQUFTO0FBQUEsVUFDUCxRQUFRLElBQUksbUJBQW1CLFNBQVMsNEJBQTRCLHNCQUFzQixJQUFJO0FBQUEsUUFDaEc7QUFBQSxNQUNGO0FBQUEsTUFDQSxNQUFNLElBQUk7QUFBQSxJQUNaO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
