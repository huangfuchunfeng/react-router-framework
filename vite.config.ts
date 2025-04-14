import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/",
  publicDir: false,
  build: {},
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  server: {
    host: true,
  },
});
