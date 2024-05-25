import { defineStore } from "pinia";

export const useAlbumsStore = defineStore({
  id: "albums",
  state: () => ({
    albums: ref<Array<ApiUserAlbum>>([]),
    featuredAlbums: ref<Array<ApiAlbum>>([]),
  }),
  actions: {},
});
