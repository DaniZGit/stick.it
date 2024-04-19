<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12">
    <div class="row-span-12 flex flex-nowrap">
      <div v-if="loading">loading packs...</div>
      <div
        v-else-if="!userPacks?.length"
        class="w-full h-full flex flex-col items-center justify-center text-xl"
      >
        <span class="flex flex-col justify-center items-center">
          <Icon name="i-mdi:face-dead-outline" size="48" />
          You have no packs
        </span>
        <span
          >Get some from the
          <NuxtLink
            to="/albums"
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
              @pending="emit('pendingOpening', $event)"
            ></AppItemUserPack>
          </template>
        </AppCarousel>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const carouselKey = ref(0); // we use this key to force carousel re-render on pack deletion, GH issue: https://github.com/primefaces/primevue/issues/4661
  const props = defineProps({
    userPacks: Array as PropType<Array<ApiUserPack>>,
    loading: Boolean,
  });

  const emit = defineEmits<{
    updatePacks: [userPacks: Array<ApiUserPack>];
    newStickers: [userStickers: Array<ApiUserSticker>];
    error: any;
    pendingOpening: any;
  }>();

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

    emit("updatePacks", localUserPacks);
    emit("newStickers", e.userStickers);
  };
</script>

<style></style>
