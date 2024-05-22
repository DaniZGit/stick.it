import { defineStore } from "pinia";

export const useAuctionStore = defineStore({
  id: "auction",
  state: () => ({
    auctionOffers: ref<Array<ApiAuctionOffer>>([]),
    albums: ref<Array<ApiAlbum>>([]),
  }),
  actions: {},
});
