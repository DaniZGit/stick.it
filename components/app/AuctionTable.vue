<template>
  <div class="w-full h-full">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="props.items"
      data-key="id"
      :paginator="false"
      :scrollable="true"
      scroll-height="flex"
      :virtualScrollerOptions="{
        lazy: true,
        onLazyLoad: (e) => console.log('on lazy load', e),
        itemSize: 46,
        delay: 200,
        showLoader: true,
        loading: false,
        numToleratedItems: 10,
      }"
      @row-expand="onRowExpand"
      @row-collapse="onRowCollapse"
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
          {{ data.user_sticker.sticker.title }}
        </template>
      </Column>
      <Column
        field="rarity"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-mdi:christmas-star-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }">
          {{ data.user_sticker.sticker.rarity?.title ?? "null" }}
        </template>
      </Column>
      <Column
        field="starting_bid"
        :sortable="true"
        sor
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-akar-icons:coin" size="16" class="mx-auto" />
        </template>
        <template #body="{ data }">
          {{ getLatestBid(data) }}
        </template>
      </Column>
      <Column
        field="time"
        :sortable="true"
        class="text-center"
        :pt="columnPreset"
      >
        <template #header>
          <Icon name="i-mdi:timer-outline" size="18" class="mx-auto" />
        </template>
        <template #body="{ data }"> {{ "12:00" }} </template>
      </Column>
      <Column expander :pt="columnPreset" />

      <template #expansion="{ data, index }">
        <div
          class="flex flex-col gap-y-3 text-app-secondary p-3"
          :class="{
            'border-b-[1px] border-app-tertiary':
              props.items?.length && index < props.items?.length - 1,
          }"
        >
          <div
            class="flex flex-col border-2 border-app-tertiary rounded-md p-3"
          >
            <h2
              class="border-b-2 border-app-tertiary text-lg font-semibold text-center"
            >
              Last bidders
            </h2>
            <div
              v-if="auctionBidders[data.id] && auctionBidders[data.id].length"
              class="grid grid-cols-3 gap-x-2 pt-4"
            >
              <div
                v-for="(auctionBid, i) in getAuctionOfferBidders(data)"
                :key="auctionBid.id"
                class="flex flex-col justify-center items-center gap-y-1 p-2 border-2 border-app-primary rounded-md last-of-type:border-app-secondary"
                :class="[
                  `col-start-${
                    3 -
                    (Math.min(getAuctionOfferBidders(data).length, 3) - 1) +
                    i
                  }`,
                ]"
              >
                <span class="text-sm">{{ auctionBid.user.username }}</span>
                <NuxtImg
                  :src="useUrl(auctionBid.user.file?.url)"
                  class="w-1/2 aspect-square rounded-full shrink"
                ></NuxtImg>
                <div class="flex items-center gap-x-1">
                  <span>{{ auctionBid.bid }}</span>
                  <Icon name="i-akar-icons:coin" size="14" />
                </div>
              </div>
            </div>
            <div
              v-else
              class="flex justify-center items-center pt-4 font-medium"
            >
              Be the first to bid!
            </div>
          </div>
          <div class="flex flex-col justify-center items-center gap-y-1">
            <div class="flex gap-x-1">
              <span>Time left:</span>
              <span class="font-bold">{{ "12:00" }}</span>
            </div>
            <AppButton
              class="w-1/2 py-1"
              :disabled="!canBid(data)"
              @click="onBid(data, getLatestBid(data) + 1)"
            >
              <div v-if="bidding">
                <Icon name="i-svg-spinners:6-dots-scale-middle" size="28" />
              </div>
              <div v-else class="flex gap-x-1 font-bold text-lg">
                <span>BID</span>
                <div class="flex items-center gap-x-1">
                  <span>{{ getLatestBid(data) + 1 }}</span>
                  <Icon name="i-akar-icons:coin" size="22" />
                </div>
              </div>
            </AppButton>
            <div class="flex gap-x-2 text-xs">
              <span>Current Amount: </span>
              <div class="flex items-center gap-x-1 font-bold">
                <span>{{ userStore.user.tokens }}</span>
                <Icon name="i-akar-icons:coin" size="14" />
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-y-2">
            <div class="text-center">
              <span
                class="text-xs underline underline-offset-2"
                @click="
                  () =>
                    (expandedRowShowDetail = {
                      [data.id]: !expandedRowShowDetail[data.id],
                    })
                "
              >
                {{ expandedRowShowDetail[data.id] ? "Hide" : "Show" }} sticker
                details
              </span>
            </div>
            <div v-if="expandedRowShowDetail[data.id]" class="gap-x-3">
              <div class="flex flex-col gap-y-1">
                <h2
                  class="text-center text-lg font-bold border-b-2 border-app-tertiary uppercase"
                >
                  sticker description
                </h2>
                <div class="flex flex-col text-center">
                  <div>
                    <span class="font-bold">Title: </span>
                    <span>{{ data.user_sticker.sticker.title }}</span>
                  </div>
                  <div>
                    <span class="font-bold">Album: </span>
                    <span> Fifa 1991 </span>
                  </div>
                  <div>
                    <span class="font-bold">Rarity: </span>
                    <span>{{
                      data.user_sticker.sticker.rarity?.title ?? "null"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    DataTableRowCollapseEvent,
  } from "primevue/datatable";
  import { useToast } from "primevue/usetoast";

  const expandedRows = ref<Record<number, boolean>>({}); // { 0: true, 1: true }
  const expandedRowShowDetail = ref<Record<string, boolean>>({});
  const toast = useToast();
  const userStore = useUserStore();

  const props = defineProps({
    items: Array<ApiAuctionOffer>,
  });

  const emit = defineEmits<{
    bid: [auctionBid: ApiAuctionBid];
  }>();

  const canBid = (auctionOffer: ApiAuctionOffer) => {
    const bidders = getAuctionOfferBidders(auctionOffer);
    return (
      getLatestBid(auctionOffer) <= userStore.user.tokens &&
      (!bidders.length ||
        bidders[bidders.length - 1].user_id != userStore.user.id)
    );
  };

  const getLatestBid = (auctionOffer: ApiAuctionOffer) => {
    return auctionOffer.latest_bid
      ? auctionOffer.latest_bid
      : auctionOffer.starting_bid;
  };

  const onRowExpand = (event: { data: ApiAuctionOffer }) => {
    const id = event.data.id;
    expandedRows.value = { [id]: true };

    // fetch bids
    fetchAuctionBidders(event.data);
  };

  const auctionBidders = ref<Record<string, Array<ApiAuctionBid>>>({});
  const fetchinBidders = ref(false);
  const fetchAuctionBidders = async (auctionOffer: ApiAuctionOffer) => {
    fetchinBidders.value = true;
    try {
      const response = await useApi<{
        auction_bids: Array<ApiAuctionBid>;
      }>(`/v1/auction/bids`, {
        params: {
          auction_offer_id: auctionOffer.id,
        },
      });

      if (response.auction_bids) {
        auctionBidders.value[auctionOffer.id] = response.auction_bids;
      }
    } catch (error) {
      console.log("auction bid err", error);
    }
    fetchinBidders.value = false;
  };

  const getAuctionOfferBidders = (auctionOffer: ApiAuctionOffer) => {
    if (!auctionBidders.value[auctionOffer.id]) return [];

    return auctionBidders.value[auctionOffer.id].slice(
      Math.max(auctionBidders.value[auctionOffer.id].length - 3, 0),
      auctionBidders.value[auctionOffer.id].length
    );
  };

  const onRowCollapse = (event: DataTableRowCollapseEvent) => {};

  const bidding = ref(false);
  const onBid = async (auctionOffer: ApiAuctionOffer, bid: number) => {
    console.log("bidding", auctionOffer, bid);
    bidding.value = true;
    try {
      const response = await useApi<{
        auction_bid: ApiAuctionBid;
      }>("/v1/auction/bids", {
        method: "POST",
        body: {
          auction_offer_id: auctionOffer.id,
          bid: bid,
        },
      });

      if (response.auction_bid) {
        userStore.user.tokens = response.auction_bid.user.tokens;
        auctionBidders.value[auctionOffer.id].push(response.auction_bid);
        emit("bid", response.auction_bid);
      }
    } catch (error) {
      console.log("auction bid err", error);
    }
    bidding.value = false;
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
    rowExpansion: "!bg-app-primary roundedd-b-lg",
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
