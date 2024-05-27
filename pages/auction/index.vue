<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12 relative">
    <div
      class="row-span-1 flex items-center gap-x-4 border-b-2 border-app-secondary overflow-x-scroll px-2"
    >
      <div class="grow overflow-x-auto no-scrollbar">
        <div v-if="loadingAlbums && !albums.length" class="text-center">
          <Icon name="i-svg-spinners:3-dots-fade" size="28" />
        </div>
        <AppSelectButton
          v-else
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
        @auction-event="onActionEvent"
        @lazy-load="onLazyLoad"
        @sort="onSort"
      ></AppAuctionTable>
    </div>
    <AppModalCreateAuctionOffer
      v-model:visible="showAuctionCreateModal"
    ></AppModalCreateAuctionOffer>

    <!-- Progress bar -->
    <div class="fixed bottom-0 left-0 right-0 h-[2px]">
      <AppSyncBar v-model="dataSyncProgress"></AppSyncBar>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { DataTableSortEvent } from "primevue/datatable";
  import type { SelectButtonChangeEvent } from "primevue/selectbutton";
  import { useAuctionStore } from "~/stores/auction";

  definePageMeta({
    auth: true,
    pageTransition: {
      name: "slide-right",
      mode: "out-in",
    },
    middleware(to, from) {
      setTransition(from, to);
    },
  });

  const userStore = useUserStore();
  const auctionStore = useAuctionStore();

  const dataSyncProgress = ref(0);
  onMounted(() => {
    auctionOffers.value = auctionStore.auctionOffers;
    albums.value = auctionStore.albums;

    fetchAuctionOffers();
    fetchAlbums();
    startWS();

    // need to add a timeout, otherwise we don't get the transition effect
    setTimeout(() => {
      dataSyncProgress.value += 50;
    }, 1);
  });

  const limit = ref(8);
  const page = ref(0);
  const sortField = ref("timespan");
  const sortOrder = ref(1);
  const auctionOffers = ref<Array<ApiAuctionOffer>>([]);
  const loadingAuctionOffers = ref(false);
  const fetchAuctionOffers = async (appendFetchedItems: boolean = false) => {
    loadingAuctionOffers.value = true;
    try {
      const response = await useApi<{
        auction_offers: Array<ApiAuctionOffer>;
        metadata: ApiMetadata;
      }>(`/v1/auction/offers`, {
        params: {
          limit: limit.value,
          page: page.value,
          sort_field: sortField.value,
          sort_order: sortOrder.value == 1 ? "ASC" : "DESC",
          album_id: selectedAlbum.value?.id ?? "asdd",
        },
      });

      if (response.auction_offers) {
        if (appendFetchedItems) {
          auctionOffers.value = auctionOffers.value.concat(
            response.auction_offers
          );
        } else {
          auctionOffers.value = response.auction_offers;
        }

        // we want to decrease current page by 1, because we want to retry the next time
        if (response.auction_offers.length <= 0) {
          page.value = Math.max(0, page.value - 1);
        }

        // sort offers
        sortAuctionOffers();

        auctionStore.auctionOffers = auctionOffers.value;
      }
    } catch (error) {
      console.log("error", error);
    }
    loadingAuctionOffers.value = false;

    dataSyncProgress.value += 25;
  };

  const onLazyLoad = () => {
    page.value += 1;
    fetchAuctionOffers(true);
  };

  const onSort = (e: DataTableSortEvent) => {
    sortField.value = e.sortField as string;
    sortOrder.value = e.sortOrder == 1 ? e.sortOrder : -1;
    page.value = 0;

    fetchAuctionOffers();
  };

  const sortAuctionOffers = () => {
    auctionOffers.value.sort((ao1, ao2) => {
      if (sortField.value == "bid") {
        return sortOrder.value == 1
          ? ao1.latest_bid - ao2.latest_bid
          : ao2.latest_bid - ao1.latest_bid;
      } else if (sortField.value == "timespan") {
        const ao1_duration = getAuctionDuration(ao1);
        const ao2_duration = getAuctionDuration(ao2);
        return sortOrder.value == 1
          ? ao1_duration - ao2_duration
          : ao2_duration - ao1_duration;
      } else {
        return 0;
      }
    });

    return auctionOffers.value;
  };

  // const currentDate = useNow();
  const getAuctionDuration = (auctionOffer: ApiAuctionOffer) => {
    const currentDate = useNow();
    const auctionEndDate = new Date(
      new Date(auctionOffer.created_at).getTime() + auctionOffer.duration
    );
    const dateDiffInMiliseconds =
      auctionEndDate.getTime() - currentDate.value.getTime();

    return dateDiffInMiliseconds;
  };

  const onActionEvent = (data: ApiAuctionEvent) => {
    console.log("new event", data);
    switch (data.type) {
      case "auction_event_created":
        onAuctionOfferCreated();
        break;
      case "auction_event_bid":
        onAuctionOfferBid(data.payload.auction_bid);
        break;
      case "auction_event_completed":
        onAuctionOfferCompleted(data);
        break;
    }

    sortAuctionOffers();
  };

  const showAuctionCreateModal = ref(false);
  const onAuctionOfferCreated = () => {
    console.log("getting new offer");
    // only re-fetch if there are so many items that scroll hasn't been shown yet
    if (auctionOffers.value.length < limit.value) {
      fetchAuctionOffers();
    }
  };

  const onAuctionOfferBid = (auctionBid: ApiAuctionBid) => {
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

  const onAuctionOfferCompleted = (auctionEvent: ApiAuctionEvent) => {
    if (auctionEvent.type != "auction_event_completed") return;

    const index = auctionOffers.value.findIndex(
      (ao) => ao.id == auctionEvent.payload.auction_offer_id
    );
    if (index >= 0) {
      auctionOffers.value.splice(index, 1);
    }

    // increase current user tokens if their auction was completed and there was a winn
    if (
      auctionEvent.payload.user_id == userStore.user.id &&
      auctionEvent.payload.winner
    ) {
      userStore.user.tokens += auctionEvent.payload.bid;
    }
  };

  const albums = ref<Array<ApiAlbum>>([]);
  const selectedAlbum = ref<ApiAlbum | null>(null);
  const loadingAlbums = ref(false);
  const fetchAlbums = async () => {
    loadingAlbums.value = true;
    try {
      const response = await useApi<{
        albums: Array<ApiAlbum>;
      }>(`/v1/albums`, {
        params: {
          limit: 99,
        },
      });

      if (response.albums) {
        albums.value = response.albums;
        auctionStore.albums = response.albums;
      }
    } catch (error) {
      console.log("error", error);
    }
    loadingAlbums.value = false;

    dataSyncProgress.value += 25;
  };

  const onAlbumSelect = (e: SelectButtonChangeEvent) => {
    selectedAlbum.value = e.value as ApiAlbum | null;
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
  };

  onUnmounted(() => {
    console.log("closing ws connection");
    websocketConn.value?.close();
  });
</script>
