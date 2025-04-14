import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false, // disable runtime server rendering
  prerender: true, // pre-render all static routes
  basename: "/", // base URL for the app
} satisfies Config;
