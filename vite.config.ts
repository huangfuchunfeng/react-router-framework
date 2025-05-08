import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/series-h5/",
  plugins: [reactRouter(), tsconfigPaths(), tailwindcss()],
  server: {
    host: true,
  },
  build: {
    cssCodeSplit: true,
  },
});
