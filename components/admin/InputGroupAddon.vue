<template>
  <InputGroupAddon v-bind="$attrs" :pt="preset">
    <slot />
  </InputGroupAddon>
</template>

<script lang="ts" setup>
  import type { InputGroupAddonPassThroughOptions } from "primevue/inputgroupaddon";

  defineOptions({
    inheritAttrs: false,
  });

  interface Props {}

  const preset: InputGroupAddonPassThroughOptions = {
    root: ({}) => ({
      class: ["flex justify-center items-center p-2 border-2 bg-base-tertiary"],
    }),
  };
</script>
