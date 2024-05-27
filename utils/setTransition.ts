import type { RouteLocationNormalized } from "vue-router";

const paths = [
  "/auction",
  "/shop",
  "/home",
  "/albums",
  "albums-id___en",
  "/settings",
  "/profile",
];
export default (from: RouteLocationNormalized, to: RouteLocationNormalized) => {
  const fromIndex = paths.findIndex((p) => p == from.path || p == from.name);
  const toIndex = paths.findIndex((p) => p == to.path || p == to.name);

  let transitions = {
    from: "slide-left",
    to: "slide-left",
  };
  if (fromIndex > toIndex) {
    transitions = { from: "slide-right", to: "slide-right" };
  }

  // set 'from' page transition
  if (to.meta.pageTransition && typeof to.meta.pageTransition !== "boolean") {
    to.meta.pageTransition.name = transitions.to;
  }

  // set 'to' page transition
  if (
    from.meta.pageTransition &&
    typeof from.meta.pageTransition !== "boolean"
  ) {
    from.meta.pageTransition.name = transitions.from;
  }
};
