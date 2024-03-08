export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  if (!userStore.isLoggedIn()) {
    return navigateTo(
      { name: "auth-login", params: { next: to.path } },
      { redirectCode: 301 }
    );
  }
});
