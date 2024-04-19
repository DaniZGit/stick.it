<template>
  <div class="w-full h-full grid grid-flow-row grid-rows-12 pt-2">
    <div class="row-span-12 flex flex-nowrap">
      <div v-if="loading">loading stickers...</div>
      <div
        v-else-if="!userStickers?.length"
        class="w-full h-full flex flex-col items-center justify-center text-xl"
      >
        <span class="flex flex-col justify-center items-center">
          <Icon name="i-mdi:face-dead-outline" size="48" />
          You have no stickers
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
      <div
        v-else
        class="w-full grid grid-cols-4 auto-rows-max gap-x-2 gap-y-5 p-2 pb-5 overflow-y-auto"
      >
        <AppItemUserSticker
          v-for="userSticker in userStickers"
          :key="userSticker.id"
          :user-sticker="userSticker"
        >
        </AppItemUserSticker>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    userStickers: Array as PropType<Array<ApiUserSticker>>,
    loading: Boolean,
  });
</script>

<style></style>
