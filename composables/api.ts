import type { IFetchError } from "ofetch";

export const useApi = <TData, TError>(
  ...params: Parameters<typeof useFetch<TData, IFetchError<TError>>>
) => {
  const { $api } = useNuxtApp();

  return useFetch(params[0], {
    $fetch: $api,
    ...params[1],
  });
};
