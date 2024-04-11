<template>
  <div class="w-full flex flex-col gap-y-2">
    <NuxtImg
      :src="useUrl(props.album?.file?.url)"
      class="w-full h-full aspect-thumbnail"
    />

    <div class="flex justify-between">
      <div class="flex gap-x-1">
        <AppIconButton @click="emit('onFirstPage')">
          <Icon name="i-mdi:chevron-double-left" size="22" />
        </AppIconButton>
        <AppIconButton @click="emit('onPrevPage')">
          <Icon name="i-mdi:chevron-left" size="22" />
        </AppIconButton>
      </div>

      <div class="flex gap-x-1">
        <AppIconButton @click="emit('onNextPage')">
          <Icon name="i-mdi:chevron-right" size="22" />
        </AppIconButton>
        <AppIconButton @click="emit('onLastPage')">
          <Icon name="i-mdi:chevron-double-right" size="22" />
        </AppIconButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    album: Object as PropType<ApiAlbum>,
  });

  const emit = defineEmits<{
    onFirstPage: [];
    onPrevPage: [];
    onNextPage: [];
    onLastPage: [];
  }>();
</script>

<style></style>
