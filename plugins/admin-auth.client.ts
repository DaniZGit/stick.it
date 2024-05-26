export default defineNuxtPlugin({
  name: "admin-auth-plugin",
  async setup(nuxtApp) {
    // Skip plugin when rendering error page
    if (nuxtApp.payload.error) {
      return {};
    }

    const userStore = useUserStore();
    // fetch user to check if admin
    try {
      const response = await useApi<{
        user: ApiUser;
      }>(`/v1/users/${userStore.user.id}`);
      console.log("fetched user", response.user);
      if (response.user) {
        userStore.user = response.user;
      }
    } catch (error) {}

    const admin = computed(() => {
      return userStore.user.role_id;
    });

    // Create a ref to know where to redirect the user when logged in
    const redirectTo = useState("authRedirect");

    addRouteMiddleware(
      "admin-auth",
      (to) => {
        if (to.meta.adminAuth && !admin.value) {
          redirectTo.value = to.path;
          return "/home";
        } else if (to.meta.adminAuth && !admin.value) {
          return "/home";
        }
      },
      { global: true }
    );

    return {
      provide: {
        adminAuth: {
          admin,
          redirectTo,
        },
      },
    };
  },
});
