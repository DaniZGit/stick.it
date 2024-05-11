<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12">
    <div class="row-span-12 flex flex-nowrap">
      <div v-if="loading">loading packs...</div>
      <div
        v-else-if="!userPacks?.length"
        class="w-full h-full flex flex-col items-center justify-center text-xl"
      >
        <span class="w-full flex flex-col justify-center items-center">
          <Icon name="i-mdi:face-dead-outline" size="48" />
          You have no packs
        </span>
        <span
          >Get some from the
          <NuxtLink
            to="/shop"
            class="text-app-gold brightness-125 font-bold underline underline-offset-2"
          >
            store
          </NuxtLink>
        </span>
      </div>
      <div v-else class="w-full">
        <AppCarousel
          :value="userPacks"
          :numVisible="1"
          :numScroll="1"
          :showNavigators="true"
          :showIndicators="false"
          :key="carouselKey"
        >
          <template #item="itemProps: { data: ApiUserPack, index: number }">
            <AppItemUserPack
              :user-pack="itemProps.data"
              @opened="onPackOpened"
              @error="emit('error', $event)"
              @pending="onPackOpening"
            ></AppItemUserPack>
          </template>
        </AppCarousel>
      </div>

      <!-- Pack animation modal -->
      <AppModalPackOpenAnimation
        v-model:visible="showPackAnimationModal"
        :user-pack="openedUserPack"
        :user-stickers="newUserStickers"
        :loading="openingPack"
        @close="onPackAnimationClose"
      ></AppModalPackOpenAnimation>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const showPackAnimationModal = ref(false);
  const carouselKey = ref(0); // we use this key to force carousel re-render on pack deletion, GH issue: https://github.com/primefaces/primevue/issues/4661
  const props = defineProps({
    userPacks: Array as PropType<Array<ApiUserPack>>,
    loading: Boolean as PropType<boolean>,
  });

  const emit = defineEmits<{
    updatePacks: [userPacks: Array<ApiUserPack>];
    newStickers: [userStickers: Array<ApiUserSticker>];
    error: any;
    pendingOpening: [boolean];
    packAnimationStart: [];
    packAnimationEnd: [];
  }>();

  const openingPack = ref(false);
  const onPackOpening = (e: { status: boolean; userPack: ApiUserPack }) => {
    openingPack.value = e.status;
    openedUserPack.value = e.userPack;

    if (e.status == true) {
      // start the pack opening animation
      showPackAnimationModal.value = true;
      emit("packAnimationStart");
    }

    emit("pendingOpening", e.status);
  };

  const openedUserPack = ref<ApiUserPack | null>(null);
  const newUserStickers = ref<Array<ApiUserSticker>>([]);
  const onPackOpened = (e: {
    userPack: ApiUserPack;
    userStickers: Array<ApiUserSticker>;
    openAll: boolean;
  }) => {
    if (!props.userPacks) return;

    console.log("inside packs tab", e);
    let localUserPacks = [...props.userPacks];
    const index = localUserPacks.findIndex((up) => up.id == e.userPack.id);
    if (index >= 0) {
      localUserPacks[index].amount -= 1;

      if (localUserPacks[index].amount <= 0 || e.openAll) {
        localUserPacks.splice(index, 1);
        carouselKey.value++;
      }
    }

    newUserStickers.value = e.userStickers;

    emit("updatePacks", localUserPacks);
    emit("newStickers", e.userStickers);
  };

  const onPackAnimationClose = () => {
    openedUserPack.value = null;
    newUserStickers.value = [];

    emit("packAnimationEnd");
  };
</script>

<style></style>
