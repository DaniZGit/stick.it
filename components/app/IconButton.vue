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

  const props = defineProps({
    color: {
      type: String as PropType<"primary" | "tertiary" | "gold">,
      default: "primary",
    },
    active: Boolean,
  });

  const preset: ButtonPassThroughOptions = {
    root: () => ({
      class: [
        "!ring-0 !ring-offset-0 hover:!ring-2 !p-1",
        {
          "!bg-app-primary hover:!bg-app-primary-focus !text-app-secondary !ring-app-secondary":
            props.color == "primary",
          "!bg-app-tertiary hover:!bg-app-tertiary-focus !text-app-secondary !ring-app-secondary":
            props.color == "tertiary",
          "!bg-app-gold hover:!bg-app-gold-focus !text-app-secondary !ring-app-secondary":
            props.color == "gold",
          "!bg-app-primary-focus": props.color == "primary" && props.active,
          "!bg-app-tertiary-focus": props.color == "tertiary" && props.active,
          "!bg-app-gold-focus": props.color == "gold" && props.active,
          "!ring-2": props.active,
        },
      ],
    }),
  };
</script>
