export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path == "/") {
    return navigateTo({ path: "/home" }, { redirectCode: 301 });
  }

  if (to.path == "/dashboard" || to.path == "/dashboard/") {
    return navigateTo({ path: "/dashboard/albums" }, { redirectCode: 301 });
  }
});
