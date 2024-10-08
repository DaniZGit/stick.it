<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12">
    <div class="row-span-12 flex flex-nowrap">
      <div v-if="props.loading">loading stickers...</div>
      <div
        v-else-if="!props.userStickers?.length"
        class="w-full h-full flex flex-col items-center justify-center text-xl"
      >
        <span class="w-full flex flex-col justify-center items-center">
          <Icon name="i-mdi:face-dead-outline" size="48" />
          You have no stickers
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
      <div
        v-else
        class="w-full grid grid-cols-4 auto-rows-max gap-x-2 gap-y-5 p-2 pb-5 overflow-y-auto"
      >
        <AppItemUserSticker
          v-for="userSticker in props.userStickers.filter((s) => s.amount > 0)"
          :key="userSticker.id"
          :user-sticker="userSticker"
          @stick="emit('stickerStick', $event)"
          @view="onStickerView"
          @drag-start="emit('stickerDragStart', $event)"
          @drag-stick="emit('stickerDragStick', $event)"
        >
        </AppItemUserSticker>
      </div>
    </div>
    <AppModalViewSticker
      v-model:visible="showStickerViewModal"
      :sticker="selectedUserSticker?.sticker"
      @hide="emit('stickerViewClose')"
    ></AppModalViewSticker>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    userStickers: Array as PropType<Array<ApiUserSticker>>,
    loading: Boolean,
  });

  const emit = defineEmits<{
    stickerView: [userSticker: ApiUserSticker | undefined];
    stickerStick: [
      data: {
        userSticker: ApiUserSticker | undefined;
        userStickerContainer: HTMLElement | null;
      }
    ];
    stickerDragStick: [userSticker: ApiUserSticker | undefined];
    stickerViewOpen: [];
    stickerViewClose: [];
    stickerDragStart: [e: any];
  }>();

  const showStickerViewModal = ref(false);
  const selectedUserSticker = ref<ApiUserSticker | null>(null);
  const onStickerView = (userSticker: ApiUserSticker) => {
    selectedUserSticker.value = userSticker;
    showStickerViewModal.value = true;
    emit("stickerViewOpen");
  };
</script>
