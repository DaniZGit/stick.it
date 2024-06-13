<template>
  <div class="w-full h-full">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="props.items"
      data-key="id"
      :paginator="false"
      :scrollable="true"
      scroll-height="flex"
      @row-expand="onRowExpand"
      @sort="emit('sort', $event)"
      :pt="tablePreset"
      :pt-options="{ mergeProps: true }"
      class="!max-w-full !max-h-full"
    >
      <Column
        field="image"
        header="Sticker"
        class="!w-1/6 !max-w-1/6"
        :pt="columnPreset"
      >
        <template #body="{ data }">
          <NuxtImg
            :src="useUrl(data.user_sticker.sticker.file.url)"
            class="w-2/3 h-auto aspect-thumbnail mx-auto object-cover"
          />
        </template>
      </Column>
      <Column field="name" :pt="columnPreset">
        <template #body="{ data }">
          <span class="text-xs">{{ data.user_sticker.sticker.title }}</span>
        </template>
      </Column>
      <Column field="rarity" class="text-center" :pt="columnPreset">
        <template #header>
          <Icon name="i-mdi:christmas-star-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }">
          <span class="text-xs">{{
            data.user_sticker.sticker.rarity?.title.at(0) ?? "null"
          }}</span>
        </template>
      </Column>
      <Column
        field="bid"
        :sortable="true"
        sor
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-akar-icons:coin" size="16" class="mx-auto" />
        </template>
        <template #body="{ data }">
          <span class="text-xs">{{ data.latest_bid }}</span>
        </template>
      </Column>
      <Column
        field="timespan"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-mdi:timer-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }">
          <span class="text-xs">{{ getTimeLeft(data) }}</span>
        </template>
      </Column>
      <Column expander :pt="columnPreset" />

      <template #expansion="{ data, index }">
        <AppItemAuctionOffer
          :auction-offer="data"
          :auction-bids="auctionBids[data.id]"
          @fetched-bids="onFetchedBids"
        ></AppItemAuctionOffer>
      </template>

      <template #empty>
        <div class="w-full h-full text-center font-semibold">
          There are currently no active auctions
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup lang="ts">
  import type { ColumnPassThroughOptions } from "primevue/column";
  import type {
    DataTablePassThroughOptions,
    DataTableSortEvent,
  } from "primevue/datatable";
  import type { PropType } from "vue";

  const expandedRows = ref<Record<string, boolean>>({}); // { 0: true, 1: true }
  const userStore = useUserStore();

  const props = defineProps({
    items: Array<ApiAuctionOffer>,
    websocketConn: Object as PropType<WebSocket | null>,
  });

  const emit = defineEmits<{
    auctionEvent: [auctionEvent: ApiAuctionEvent];
    lazyLoad: [];
    sort: [e: DataTableSortEvent];
  }>();

  const tableWrapper = ref<HTMLElement | null>(null);
  const { arrivedState } = useScroll(tableWrapper, {
    offset: { bottom: 50 },
  });
  onMounted(() => {
    tableWrapper.value = document.querySelector<HTMLElement>(
      "div[data-pc-section='wrapper']"
    );
  });

  // load new items when we arrive to the bottom
  watch(
    () => arrivedState.bottom,
    (newBottom, oldBottom) => {
      if (newBottom) {
        emit("lazyLoad");
      }
    }
  );

  // listen to ws when ready
  watch(
    () => props.websocketConn,
    (newWebsocketConn, oldWebsocketConn) => {
      if (newWebsocketConn) {
        listenToWs();
      }
    }
  );

  const auctionBids = ref<Record<string, Array<ApiAuctionBid>>>({});
  const listenToWs = () => {
    if (!props.websocketConn) return;

    props.websocketConn.onmessage = (evt) => {
      const data = JSON.parse(evt.data) as ApiAuctionEvent;
      switch (data.type) {
        case "auction_event_created":
          break;
        case "auction_event_bid":
          const auctionBid = data.payload.auction_bid;
          if (!auctionBids.value[auctionBid.auction_offer_id])
            auctionBids.value[auctionBid.auction_offer_id] = [];

          // check if new bidder is this user, decrement their tokens
          if (auctionBid.user_id == userStore.user.id) {
            userStore.user.tokens -= auctionBid.bid;
          }

          // check if last bidder is this user, increment their tokens
          if (data.payload.last_auction_bid.user_id == userStore.user.id) {
            userStore.user.tokens += data.payload.last_auction_bid.bid;
          }

          // add new auction bid to the array - to display it
          auctionBids.value[auctionBid.auction_offer_id].push(auctionBid);
          break;
        case "auction_event_completed":
          break;
      }

      emit("auctionEvent", data);
    };
  };

  const onFetchedBids = (data: {
    auctionBids: Array<ApiAuctionBid>;
    auctionOffer: ApiAuctionOffer;
  }) => {
    auctionBids.value[data.auctionOffer.id] = data.auctionBids;
  };

  const onRowExpand = (event: { data: ApiAuctionOffer }) => {
    const id = event.data.id;
    expandedRows.value = { [id]: true };
  };

  const currentDate = useNow();
  const getTimeLeft = (auctionOffer: ApiAuctionOffer) => {
    const auctionEndDate = new Date(
      new Date(auctionOffer.created_at).getTime() + auctionOffer.duration
    );
    const dateDiffInMiliseconds =
      auctionEndDate.getTime() - currentDate.value.getTime();

    return new Date(Math.max(dateDiffInMiliseconds, 0))
      .toISOString()
      .slice(11, -5);
  };

  const tablePreset: DataTablePassThroughOptions = {
    table: "!relative",
    bodyRow: ({ context, state }) => ({
      class: [
        "!bg-app-primary !text-app-secondary",
        {
          "!bg-app-tertiary":
            expandedRows.value && expandedRows.value[context.index],
        },
      ],
    }),
    rowExpansion: "!bg-app-primary ",
    rowExpansionCell: "!rounded-b-lg",
    header: "!sticky !top-0",
    headerRow: "!sticky !top-0",
  };

  const columnPreset: ColumnPassThroughOptions = {
    headerContent: "!sticky !top-0",
    bodyCell: "!border-app-tertiary",
    headerCell: "!bg-app-primary !text-app-secondary !border-app-tertiary",
  };
</script>

<style>
  /* emptyMessageCell property from PrimeVue doesn't work - so we target it this way */
  td[data-pc-section="emptymessagecell"] {
    border-color: #fff;
  }
</style>
