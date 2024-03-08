<template>
  <Checkbox v-bind="$attrs" :pt="preset" :pt-options="{ mergeProps: true }">
    <slot />
  </Checkbox>
</template>

<script lang="ts" setup>
  import type { CheckboxPassThroughOptions } from "primevue/checkbox";

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {}

  const preset: CheckboxPassThroughOptions = {
    box: ({ props }) => ({
      class: "!bg-base-tertiary outline-0",
    }),
    icon: ({ props }) => ({
      class: [
        {
          "w-full h-full bg-base-blue !text-base-white": props.trueValue,
        },
      ],
    }),
  };
</script>
