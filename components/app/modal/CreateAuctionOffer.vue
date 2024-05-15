<template>
  <AppDialog
    v-model:visible="isVisible"
    :modal="true"
    :draggable="false"
    header="Create an auction offer"
    :loading="auctioning"
    @show="onDialogShow"
    @hide="onDialogHide"
  >
    <div class="h-full w-full grid grid-flow-row grid-rows-12 py-2">
      <div
        class="row-span-1 flex items-center bg-app-primary rounded-md px-2 overflow-x-auto"
      >
        <div
          class="w-full overflow-x-auto no-scrollbar border-r-2 border-app-secondary"
        >
          <AppSelectButton
            v-model="selectedAlbum"
            :options="albums"
            optionLabel="title"
            class="mx-auto"
          ></AppSelectButton>
        </div>
      </div>

      <div
        class="row-span-8 flex flex-col gap-y-2 text-app-secondary text-center py-2"
      >
        <h2 class="font-semibold text-lg">Select a sticker to auction</h2>
        <div class="grid grid-cols-4 gap-x-4 gap-y-6 overflow-y-auto p-1 pb-4">
          <AppItemAuctionUserSticker
            v-for="(userSticker, i) in userStickers.filter(
              (us) =>
                us.amount > 0 &&
                (!selectedAlbum || us.album?.id == selectedAlbum?.id)
            )"
            :key="userSticker.id"
            :user-sticker="userSticker"
            :is-selected="
              selectedUserSticker && userSticker.id == selectedUserSticker.id
            "
            @select="onStickerSelect"
          ></AppItemAuctionUserSticker>
        </div>
      </div>

      <div class="row-span-3 flex flex-col justify-between py-2">
        <div class="text-app-secondary text-center">
          <label for="startingBid">Set a starting bid (in tokens)</label>
          <AppInputNumber
            id="startingBid"
            v-model="startingBid"
            placeholder="Type tokens amount, ex. 125"
            :min="1"
            :max-fraction-digits="0"
            class="!text-center"
            inputClass="text-center"
          ></AppInputNumber>
        </div>
        <div class="text-center">
          <AppButton
            class="!py-2 w-1/2"
            :disabled="!startingBid || !selectedUserSticker || auctioning"
            @click="onAuction"
          >
            Auction it!
          </AppButton>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const isVisible = defineModel("visible", { type: Boolean });
  const userStore = useUserStore();

  const emit = defineEmits<{
    created: [auctionOffer: ApiAuctionOffer];
  }>();

  const startingBid = ref<number | null>(null);
  const selectedAlbum = ref<ApiAlbum | null>(null);

  const userStickers = ref<Array<ApiUserSticker>>([]);
  const albums = ref<Array<ApiAlbum>>([]);
  const loadingStickers = ref(false);
  const fetchStickers = async () => {
    console.log("fetching stickers");
    loadingStickers.value = true;
    try {
      const response = await useApi<{
        user_stickers: Array<ApiUserSticker>;
      }>(`/v1/users/${userStore.user.id}/stickers`);

      if (response.user_stickers) {
        userStickers.value = response.user_stickers;
        userStickers.value.forEach((us) => {
          if (us.album && !albums.value.some((a) => a.id == us.album?.id)) {
            albums.value.push(us.album);
          }
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    loadingStickers.value = false;
  };

  const onDialogShow = () => {
    if (userStickers.value.length) return;

    fetchStickers();
  };

  const onDialogHide = () => {
    selectedUserSticker.value = null;
    selectedAlbum.value = null;
    startingBid.value = null;
  };

  const selectedUserSticker = ref<ApiUserSticker | null>(null);
  const onStickerSelect = (userSticker: ApiUserSticker) => {
    selectedUserSticker.value = userSticker;
  };

  const auctioning = ref(false);
  const onAuction = async () => {
    if (!selectedUserSticker.value) return;

    auctioning.value = true;
    try {
      const response = await useApi<{
        auction_offer: ApiAuctionOffer;
      }>(`/v1/auction/offers`, {
        method: "POST",
        body: {
          user_sticker_id: selectedUserSticker.value.id,
          starting_bid: startingBid.value,
        },
      });

      if (response.auction_offer) {
        emit("created", response.auction_offer);

        const index = userStickers.value.findIndex(
          (us) => us.id == selectedUserSticker.value?.id
        );
        if (index >= 0) {
          userStickers.value[index].amount--;
        }
      }

      isVisible.value = false;
    } catch (error) {
      console.log("error", error);
    }
    auctioning.value = false;
  };
</script>

<style></style>
