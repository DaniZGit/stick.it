<template>
  <Dropdown
    v-model="selected"
    :options="options"
    :placeholder="placeholder"
    checkmark
    :highlightOnSelect="false"
  >
  </Dropdown>
</template>

<script lang="ts" setup>
  import type { PaginatorPassThroughOptions } from "primevue/paginator";
  import { number, string } from "zod";

  const attrs = useAttrs();
  defineOptions({
    inheritAttrs: false,
  });

  const emit = defineEmits<{
    page: [page: any];
  }>();

  const selected = defineModel();

  defineProps({
    options: Array<any>,
    placeholder: string,
  });

  const preset: PaginatorPassThroughOptions = {};
</script>
