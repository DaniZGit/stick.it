<template>
  <Button :pt="preset" :pt-options="{ mergeProps: true }">
    <slot />
  </Button>
</template>

<script lang="ts" setup>
  import type { ButtonPassThroughOptions } from "primevue/button";

  defineOptions({
    inheritAttrs: true,
  });

  const preset: ButtonPassThroughOptions = {
    root: ({ props }) => ({
      class: [
        "!bg-app-primary focus:!bg-app-primary-focus !text-app-secondary border-2 border-app-secondary !ring-0 focus:!ring-0",
      ],
    }),
  };
</script>
