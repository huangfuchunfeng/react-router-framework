import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/:seriesId?", "routes/home/home.tsx"),
  route("view", "routes/view/view.tsx"),
] satisfies RouteConfig;
