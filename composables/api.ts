import type { NitroFetchRequest } from "nitropack";

export const useApi = <
  TData,
  TError extends NitroFetchRequest = NitroFetchRequest
>(
  ...options: Parameters<typeof $fetch<TData, TError>>
) => {
  const route = useRoute();
  const userStore = useUserStore();

  console.log(userStore.user);
  return $fetch<TData, TError>(options[0], {
    baseURL: useRuntimeConfig().public.apiUrl,
    headers: {
      Authorization: `Bearer ${userStore.user.token}`,
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
    ...options[1],
  });
};
