import { defineStore } from "pinia";

export const useShopStore = defineStore({
  id: "shop",
  state: () => ({
    packs: ref<Array<ApiPack>>(),
    bundles: ref<Array<ApiBundle>>([]),
  }),
  actions: {},
});
