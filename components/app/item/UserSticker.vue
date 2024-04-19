<template>
  <div class="aspect-thumbnail w-full group relative">
    <NuxtImg
      :src="useUrl(props.userSticker?.sticker.file?.url)"
      class="w-auto h-auto aspect-thumbnail rounded-md ring-app-secondary group-hover:ring-2 group-focus:ring-2 duration-100"
    ></NuxtImg>
    <div class="absolute bottom-0 left-0 right-0 flex justify-center">
      <Badge
        :value="userSticker?.amount"
        class="translate-y-1/2 !bg-app-primary !text-app-secondary ring-app-secondary group-hover:ring-1 group-focus:ring-1"
      ></Badge>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    userSticker: Object as PropType<ApiUserSticker>,
  });
</script>

<style></style>
