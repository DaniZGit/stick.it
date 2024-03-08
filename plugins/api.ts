export default defineNuxtPlugin((nuxtApp) => {
  const route = useRoute();
  const userStore = useUserStore();

  const api = $fetch.create({
    baseURL: useRuntimeConfig().public.apiUrl,
    headers: {
      Authorization: `Bearer ${userStore.getToken()}`,
    },
    onResponse: ({ response }) => {
      if (response.ok) return;
      console.log("og responsesse");

      // redirect to login page if we get an 401(unauthorized) error
      if (route.name != "auth-login" && response.status == 401) {
        // userStore.logout();
        navigateTo("/auth/login");
      }
    },
  });

  return {
    provide: {
      api: api,
    },
  };
});
