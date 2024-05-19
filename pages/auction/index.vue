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
      <AppAuctionTable
        :items="auctionOffers"
        :websocket-conn="websocketConn"
        @bid="onBid"
      ></AppAuctionTable>
    </div>
    <AppModalCreateAuctionOffer
      v-model:visible="showAuctionCreateModal"
      @created="onAuctionOfferCreated"
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
    startWS();
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

  const onAlbumSelect = (e: any) => {
    console.log(e);
  };

  const onBid = (auctionBid: ApiAuctionBid) => {
    const index = auctionOffers.value.findIndex(
      (ao) => ao.id == auctionBid.auction_offer_id
    );

    if (index >= 0) {
      const auctionOffer = auctionOffers.value[index];

      // increase latest_bid amount
      auctionOffer.latest_bid = auctionBid.bid;

      // increase time by 5 minutes, if only time left is below 5 minutes
      const currentDate = useNow();
      const auctionEndDate = new Date(
        new Date(auctionOffer.created_at).getTime() + auctionOffer.duration
      );
      const dateDiffInMiliseconds =
        auctionEndDate.getTime() - currentDate.value.getTime();

      if (dateDiffInMiliseconds < 300000) {
        auctionOffer.duration += 300000;
      }
    }
  };

  const onAuctionOfferCreated = (auctionOffer: ApiAuctionOffer) => {
    fetchAuctionOffers();
  };

  const websocketConn = ref<WebSocket | null>(null);
  const startWS = () => {
    websocketConn.value = new WebSocket(
      `${useRuntimeConfig().public.apiWebsocketUrl}/v1/auction/ws`
    );

    websocketConn.value.onopen = function (evt) {
      console.log("connection opened", evt);
    };

    websocketConn.value.onclose = function (evt) {
      console.log("connection closed", evt);
    };

    listenToWs();
  };

  const listenToWs = () => {
    if (!websocketConn.value) return;

    websocketConn.value.onmessage = (evt) => {
      const data = JSON.parse(evt.data) as ApiAuctionEvent;
      switch (data.type) {
        case "auction_event_created":
          fetchAuctionOffers();
          break;
        case "auction_event_bid":
          onBid(data.payload);
          break;
        case "auction_event_completed":
          // only add new bids from other users
          const index = auctionOffers.value.findIndex(
            (ao) => ao.id == data.payload.id
          );
          if (index >= 0) {
            auctionOffers.value.splice(index, 1);
          }
          break;
      }
    };
  };
</script>
