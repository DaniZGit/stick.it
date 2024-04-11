<template>
  <div class="flex flex-col">
    <NuxtImg :src="useUrl(props.sticker?.file?.url)"></NuxtImg>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    sticker: Object as PropType<ApiSticker>,
  });
</script>

<style></style>
