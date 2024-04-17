<template>
  <Carousel v-bind="$attrs" :pt="preset" :pt-options="{ mergeProps: true }">
    <template #item="itemProps: { data: any, index: number }">
      <slot name="item" v-bind="itemProps"></slot>
    </template>
  </Carousel>
</template>

<script lang="ts" setup>
  import type { CarouselPassThroughOptions } from "primevue/carousel";

  defineOptions({
    inheritAttrs: true,
  });

  const preset: CarouselPassThroughOptions = {
    root: "h-full",
    content: "h-full",
    container: "h-full",
    itemsContent: "h-full",
    itemsContainer: "h-full",
    previousButton: "!text-app-secondary disabled:!text-app-primary",
    nextButton: "!text-app-secondary disabled:!text-app-primary",
  };
</script>

<style></style>
