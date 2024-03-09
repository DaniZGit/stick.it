<template>
  <InlineMessage v-bind="attrs" :pt="preset" class="outline-0 border-0">
    <slot />
  </InlineMessage>
</template>

<script lang="ts" setup>
  import type { InlineMessagePassThroughOptions } from "primevue/inlinemessage";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const preset: InlineMessagePassThroughOptions = {
    root: "",
    text: "text-md text-red-700",
    icon: "hidden",
  };
</script>
