<template>
  <AppDialog v-model:visible="isVisible" :modal="true" :draggable="false">
    <div class="h-full w-full flex flex-col justify-center">
      <div class="w-full aspect-thumbnail p-2 rounded-md">
        <NuxtImg
          :src="useUrl(props.sticker?.file?.url)"
          class="w-full h-full aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
        ></NuxtImg>
      </div>
      <div class="flex flex-col gap-y-2 text-app-secondary rounded-md p-2">
        <div class="flex flex-col items-center">
          <span class="text-center font-bold text-xl">{{
            props.sticker?.title
          }}</span>
          <span class="text-xs">
            (
            {{ props.sticker?.rarity?.title ?? "base" }}
            )
          </span>
        </div>
      </div>
    </div>
  </AppDialog>
</template>

<script lang="ts" setup>
  const isVisible = defineModel("visible", { type: Boolean });

  const props = defineProps({
    sticker: Object as PropType<ApiSticker>,
  });
</script>

<style></style>
