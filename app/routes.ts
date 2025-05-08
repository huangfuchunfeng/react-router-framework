import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [route("/:seriesId?", "routes/home/home.tsx")] satisfies RouteConfig;
