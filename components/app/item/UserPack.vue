<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12 group p-1">
    <div class="row-span-1 text-center relative overflow-x-hidden">
      &nbsp;
      <!-- text-nowrap break carousel, so we need to make it as absolute - dunno why -->
      <div class="absolute bottom-0 top-0 left-0 right-0">
        <div
          ref="titleRef"
          class="inline-block text-nowrap font-semibold tracking-wider"
          :class="{
            'overflow-animation': titleIsOverflown,
          }"
        >
          {{ props.userPack.pack.title }}
        </div>
      </div>
    </div>
    <div class="row-span-9 flex justify-center py-2">
      <NuxtImg
        :src="useUrl(props.userPack.pack.file?.url)"
        class="w-auto h-auto aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 duration-0"
      ></NuxtImg>
    </div>
    <div class="row-span-2 flex flex-col gap-y-1 px-4">
      <div
        class="grid gap-x-4"
        :class="{ 'grid-cols-2': props.userPack.amount > 1 }"
      >
        <AppButton
          class="text-xs !py-1.5"
          :disabled="openingPacks"
          @click="openPacks(false)"
        >
          Open
        </AppButton>
        <AppButton
          class="text-xs !py-1.5"
          v-if="props.userPack.amount > 1"
          :disabled="openingPacks"
          @click="openPacks(true)"
        >
          Open All
        </AppButton>
      </div>
      <div class="flex justify-center items-center gap-x-1">
        <span class="text-app-gold brightness-150 text-xs font-bold">
          {{ props.userPack.amount }}
        </span>
        <span class="text-xs">
          {{ props.userPack.amount > 1 ? "packs" : "pack" }} left
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const titleRef = ref<HTMLElement | null>(null);
  const userStore = useUserStore();
  const route = useRoute();
  const { t } = useI18n();
  const titleIsOverflown = ref(false);

  const props = defineProps<{
    userPack: ApiUserPack;
  }>();

  const emit = defineEmits<{
    opened: [
      {
        userPack: ApiUserPack;
        userStickers: Array<ApiUserSticker>;
        openAll: boolean;
      }
    ];
    error: [message: string];
    pending: [
      {
        status: boolean;
        userPack: ApiUserPack;
      }
    ];
  }>();

  const openingPacks = ref(false);
  const openPacks = async (openAll: boolean) => {
    console.log("opening packs");
    openingPacks.value = true;
    emit("pending", {
      status: true,
      userPack: props.userPack,
    });
    try {
      const response = await useApi<{
        user_stickers: Array<ApiUserSticker>;
      }>(`/v1/users/${userStore.user.id}/open-packs`, {
        method: "POST",
        body: {
          album_id: route.params.id,
          pack_id: props.userPack.pack_id,
          open_all: openAll,
        },
      });

      console.log("response", response);

      emit("opened", {
        userPack: props.userPack,
        userStickers: response.user_stickers,
        openAll: openAll,
      });
    } catch (error) {
      emit("error", t("unexpected-error"));
    }
    openingPacks.value = false;
    emit("pending", {
      status: false,
      userPack: props.userPack,
    });
  };

  watch(titleRef, (oldTitleRef, newTitleRef) => {
    if (!newTitleRef || !newTitleRef.parentElement) return;

    titleIsOverflown.value =
      newTitleRef.clientWidth >= newTitleRef.parentElement.clientWidth;
  });
</script>

<style scoped>
  .overflow-animation {
    -webkit-animation: moving 10s infinite linear;
    animation: moving 10s infinite linear;
  }

  @keyframes moving {
    0%,
    40% {
      transform: translateX(0px);
    }
    85%,
    100% {
      transform: translateX(-50%);
    }
  }
</style>
