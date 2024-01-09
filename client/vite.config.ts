import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: process.env.VITE_SERVER_LINK,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      "/.*": {
        target: "/",
      },
    },
  };
});
