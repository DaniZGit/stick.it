<template>
  <Button :pt="preset" :pt-options="{ mergeProps: true }">
    <slot />
  </Button>
</template>

<script lang="ts" setup>
  import type { ButtonPassThroughOptions } from "primevue/button";
  import type { PropType } from "vue";

  defineOptions({
    inheritAttrs: true,
  });

  const props = defineProps({
    color: {
      type: String as PropType<"primary" | "tertiary">,
      default: "primary",
    },
  });

  const preset: ButtonPassThroughOptions = {
    root: () => ({
      class: [
        "!ring-offset-0 hover:!ring-2",
        {
          "!bg-app-primary hover:!bg-app-primary-focus !text-app-secondary !ring-app-secondary":
            props.color == "primary",
          "!bg-app-tertiary hover:!bg-app-tertiary-focus !text-app-secondary !ring-app-secondary":
            props.color == "tertiary",
        },
      ],
    }),
  };
</script>
