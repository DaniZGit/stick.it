export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path == "/") {
    return navigateTo({ path: "/home" }, { redirectCode: 301 });
  }

  if (to.path == "/dashboard" || to.path == "/dashboard/") {
    return navigateTo({ path: "/dashboard/albums" }, { redirectCode: 301 });
  }

  if (to.name == "auth-login" || to.name == "auth-register") {
    const userStore = useUserStore();
    if (userStore.isLoggedIn()) {
      return navigateTo({ name: "home" }, { redirectCode: 301 });
    }
  }
});
