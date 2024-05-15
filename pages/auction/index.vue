<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12 relative">
    <div
      class="row-span-1 flex items-center gap-x-4 border-b-2 border-app-secondary overflow-x-scroll px-2"
    >
      <div class="grow overflow-x-auto no-scrollbar">
        <AppSelectButton
          v-model="selectedAlbum"
          :options="albums"
          optionLabel="title"
          @change="onAlbumSelect"
          class="mx-auto"
        ></AppSelectButton>
      </div>
      <AppButton class="!py-1 px-8" @click="showAuctionCreateModal = true"
        >Create</AppButton
      >
    </div>
    <div class="row-span-11">
      <AppAuctionTable :items="auctionOffers"></AppAuctionTable>
    </div>
    <AppModalCreateAuctionOffer
      v-model:visible="showAuctionCreateModal"
      @created="onAuctionOfferCreate"
    ></AppModalCreateAuctionOffer>
  </div>
</template>

<script setup lang="ts">
  const selectedAlbum = ref<ApiAlbum | null>(null);
  const albums = ref<Array<Object>>([
    {
      id: "ad",
      title: "Album 1",
    },
    {
      id: "ad",
      title: "Album 2",
    },
    {
      id: "ad",
      title: "Album 3",
    },
    {
      id: "ad",
      title: "Album 4",
    },
  ]);

  onMounted(() => {
    fetchAuctionOffers();
  });

  const auctionOffers = ref<Array<ApiAuctionOffer>>([]);
  const loadingAuctionOffers = ref(false);
  const fetchAuctionOffers = async () => {
    console.log("fetching stickers");
    loadingAuctionOffers.value = true;
    try {
      const response = await useApi<{
        auction_offers: Array<ApiAuctionOffer>;
      }>(`/v1/auction/offers`);

      if (response.auction_offers) {
        auctionOffers.value = response.auction_offers;
      }
    } catch (error) {
      console.log("error", error);
    }
    loadingAuctionOffers.value = false;
  };

  const showAuctionCreateModal = ref(false);

  const onAlbumSelect = (e) => {
    console.log(e);
  };

  const onAuctionOfferCreate = (auctionOffer: ApiAuctionOffer) => {
    console.log("new auction offer", auctionOffer);
  };
</script>
