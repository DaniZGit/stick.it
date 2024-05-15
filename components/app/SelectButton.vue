<template>
  <SelectButton
    v-bind="$attrs"
    aria-labelledby="basic"
    :pt="preset"
    :pt-options="{ mergeProps: true }"
    class="overflow-visible bg-app-prim"
  />
</template>

<script lang="ts" setup>
  import type { SelectButtonPassThroughOptions } from "primevue/selectbutton";

  const preset: SelectButtonPassThroughOptions = {
    root: () => ({
      class: ["flex"],
    }),
    button: ({ context }) => ({
      class: [
        "!bg-app-primary !hover:bg-app-tertiary !text-app-secondary text-nowrap overflow-visible border-2 border-app-primary hover:ring-0 focus:ring-0",
        {
          "border-app-secondary": context.active,
        },
      ],
    }),
  };
</script>

<style></style>
