<template>
  <ProgressBar v-bind="$attrs" :pt="preset">
    <slot />
  </ProgressBar>
</template>

<script lang="ts" setup>
  import type { ProgressBarPassThroughOptions } from "primevue/progressbar";

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {}
  const preset: ProgressBarPassThroughOptions = {
    root: "w-full bg-base-tertiary brightness-90 h-2 rounded-md ",
    value: ({}) => ({
      class: "w-full bg-base-blue h-2 rounded-md duration-500",
    }),
  };
</script>
