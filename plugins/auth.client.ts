export default defineNuxtPlugin({
  name: "auth-plugin",
  async setup(nuxtApp) {
    // Skip plugin when rendering error page
    if (nuxtApp.payload.error) {
      return {};
    }

    const userStore = useUserStore();
    const loggedIn = computed(() => {
      return userStore.user.token && userStore.user.token.length > 0;
    });

    // Create a ref to know where to redirect the user when logged in
    const redirectTo = useState<string>("authRedirect");

    addRouteMiddleware(
      "auth",
      (to) => {
        if (to.meta.auth && !loggedIn.value) {
          redirectTo.value = to.path;
          return "/auth/login";
        }
      },
      { global: true }
    );

    const currentRoute = useRoute();

    if (process.client) {
      watch(loggedIn, async (loggedIn) => {
        if (!loggedIn && currentRoute.meta.auth) {
          redirectTo.value = currentRoute.path;
          await navigateTo("/auth/login");
        }
      });
    }

    if (loggedIn.value && currentRoute.path === "/auth/login") {
      await navigateTo(redirectTo.value || "/");
    }

    return {
      provide: {
        auth: {
          loggedIn,
          redirectTo,
        },
      },
    };
  },
});
