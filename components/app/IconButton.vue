<template>
  <Button :pt="preset" :pt-options="{ mergeProps: true }">
    <slot />
  </Button>
</template>

<script lang="ts" setup>
  import type { ButtonPassThroughOptions } from "primevue/button";

  type ButtonColor = "base";
  type ButtonType = "button" | "submit" | "reset" | undefined;

  defineOptions({
    inheritAttrs: true,
  });

  const preset: ButtonPassThroughOptions = {
    root: ({ props }) => ({
      class: [
        "!bg-app-primary focus:!bg-app-primary-focus !text-app-secondary !ring-app-secondary !ring-0 !ring-offset-0 focus:!ring-2 !p-1",
      ],
    }),
  };
</script>
