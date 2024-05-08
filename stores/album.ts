import { defineStore } from "pinia";

type StickingStatus = "idle" | "sticking";

export const useAlbumStore = defineStore({
  id: "album",
  state: () => ({
    userSticker: undefined as ApiUserSticker | undefined,
    pendingAnimation: false,
    pendingRequest: false,
  }),
  actions: {},
});
