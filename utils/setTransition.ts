import type { RouteLocationNormalized } from "vue-router";

const paths = ["auction", "shop", "home", "album", "settings"];
export default (from: RouteLocationNormalized, to: RouteLocationNormalized) => {
  const fromIndex = paths.findIndex((p) => p == from.path);
  const toIndex = paths.findIndex((p) => p == to.path);

  console.log("from - to");
  console.log(fromIndex, toIndex);

  if (fromIndex > toIndex) {
    return "slide-right";
  } else {
    return "slide-left";
  }
};
