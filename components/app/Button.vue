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

  const { color } = withDefaults(
    defineProps<{
      color?: "primary" | "tertiary";
    }>(),
    {
      color: "primary",
    }
  );

  const preset: ButtonPassThroughOptions = {
    root: ({ props }) => ({
      class: [
        "!ring-offset-0 focus:!ring-2",
        {
          "!bg-app-primary focus:!bg-app-primary-focus !text-app-secondary !ring-app-secondary":
            color == "primary",
          "!bg-app-tertiary focus:!bg-app-tertiary-focus !text-app-secondary !ring-app-secondary":
            color == "tertiary",
        },
      ],
    }),
  };
</script>
