<template>
  <div
    class="flex flex-col gap-y-3 text-app-secondary border-b-[1px] border-app-tertiary p-3"
  >
    <div class="flex flex-col border-2 border-app-tertiary rounded-md p-3">
      <h2
        class="border-b-2 border-app-tertiary text-lg font-semibold text-center"
      >
        Last bidders
      </h2>
      <div v-if="auctionBidders.length" class="grid grid-cols-3 gap-x-2 pt-4">
        <div
          v-for="(auctionBid, i) in getAuctionOfferBidders()"
          :key="auctionBid.id"
          class="flex flex-col justify-center items-center gap-y-1 p-2 border-2 border-app-primary rounded-md last-of-type:border-app-secondary"
          :class="[
            `col-start-${3 - (getAuctionOfferBidders().length - 1) + i}`,
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
      <div v-else class="flex justify-center items-center pt-4 font-medium">
        Be the first to bid!
      </div>
    </div>
    <div class="flex flex-col justify-center items-center gap-y-1">
      <div class="flex gap-x-1">
        <span>Time left:</span>
        <span class="font-bold">{{
          formattedTime(new Date(props.auctionOffer.created_at))
        }}</span>
      </div>
      <AppButton class="w-1/2 py-1" :disabled="!canBid()" @click="onBid">
        <div v-if="bidding">
          <Icon name="i-svg-spinners:6-dots-scale-middle" size="28" />
        </div>
        <div v-else class="flex gap-x-1 font-bold text-lg">
          <span>BID</span>
          <div class="flex items-center gap-x-1">
            <span>{{ getLatestBid() + 1 }}</span>
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
          @click="showDetail != showDetail"
        >
          {{ showDetail ? "Hide" : "Show" }} sticker details
        </span>
      </div>
      <div v-if="showDetail" class="gap-x-3">
        <div class="flex flex-col gap-y-1">
          <h2
            class="text-center text-lg font-bold border-b-2 border-app-tertiary uppercase"
          >
            sticker description
          </h2>
          <div class="flex flex-col text-center">
            <div>
              <span class="font-bold">Title: </span>
              <span>{{ props.auctionOffer.user_sticker.sticker.title }}</span>
            </div>
            <div>
              <span class="font-bold">Album: </span>
              <span> Fifa 1991 </span>
            </div>
            <div>
              <span class="font-bold">Rarity: </span>
              <span>{{
                props.auctionOffer.user_sticker.sticker.rarity?.title ?? "null"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const showDetail = ref(false);
  const userStore = useUserStore();

  const props = defineProps({
    auctionOffer: {
      type: Object as PropType<ApiAuctionOffer>,
      required: true,
    },
  });

  const emit = defineEmits<{
    bid: [auctionBid: ApiAuctionBid];
  }>();

  onMounted(() => {
    fetchAuctionBidders();
  });

  const auctionBidders = ref<Array<ApiAuctionBid>>([]);
  const fetchinBidders = ref(false);
  const fetchAuctionBidders = async () => {
    console.log("fetching bidders");
    fetchinBidders.value = true;
    try {
      const response = await useApi<{
        auction_bids: Array<ApiAuctionBid>;
      }>(`/v1/auction/bids`, {
        params: {
          auction_offer_id: props.auctionOffer.id,
        },
      });

      if (response.auction_bids) {
        auctionBidders.value = response.auction_bids;
      }
    } catch (error) {
      console.log("auction bid err", error);
    }
    fetchinBidders.value = false;
  };

  const getAuctionOfferBidders = () => {
    return auctionBidders.value.slice(
      Math.max(auctionBidders.value.length - 3, 0),
      auctionBidders.value.length
    );
  };

  const getLatestBid = () => {
    return props.auctionOffer.latest_bid
      ? props.auctionOffer.latest_bid
      : props.auctionOffer.starting_bid;
  };

  const canBid = () => {
    const bidders = getAuctionOfferBidders();
    return (
      getLatestBid() <= userStore.user.tokens &&
      (!bidders.length ||
        bidders[bidders.length - 1].user_id != userStore.user.id)
    );
  };

  const bidding = ref(false);
  const onBid = async () => {
    bidding.value = true;
    try {
      const response = await useApi<{
        auction_bid: ApiAuctionBid;
      }>("/v1/auction/bids", {
        method: "POST",
        body: {
          auction_offer_id: props.auctionOffer.id,
        },
      });

      if (response.auction_bid) {
        userStore.user.tokens = response.auction_bid.user.tokens;
        auctionBidders.value.push(response.auction_bid);
        emit("bid", response.auction_bid);
      }
    } catch (error) {
      console.log("auction bid err", error);
    }
    bidding.value = false;
  };

  const formattedTime = (date: Date) => {
    const hours = date.getUTCHours();
    const minutes = date.getMinutes();
    const seconds = date.getUTCSeconds();

    return (
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  };
</script>

<style></style>
