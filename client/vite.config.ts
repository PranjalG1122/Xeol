import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ command, mode }) => {
  const server = new URL(loadEnv(mode, process.cwd(), "").VITE_SERVER_LINK);
  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: server,
          changeOrigin: true,
        },
      },
      "/.*": {
        target: "/",
      },
    },
  };
});
